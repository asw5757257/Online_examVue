<template>
    <div>
    <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/teacherhome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>管理</el-breadcrumb-item>
  <el-breadcrumb-item>详情</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片 -->
<el-card class="box-card">
    <!-- 搜索和添加 -->
  
  <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable 
        @clear="getPaperList">
        <el-button slot="append" icon="el-icon-search" @click="queryPaper"></el-button>
    </el-input>
      </el-col>
      <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加试卷</el-button>
      </el-col>
  </el-row>
  <!-- 试卷列表 -->
  <el-table :data="paperList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="试卷名字" prop="name">
      </el-table-column>
      <el-table-column label="查看试卷" width="80px" >
            <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看试卷" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-tickets" size="mini" @click="getPaperDetail(scope)"></el-button>
            </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="添加试题" width="80px">
            <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="添加试题" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-tickets" size="mini" @click="showAddQuestion(scope)"></el-button>
            </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="发布试卷" width="80px" >
            <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="发布试卷" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-tickets" size="mini" @click="publicPaper(scope)"></el-button>
            </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="是否可编辑" prop="isEdit" width="50px"></el-table-column>
      <el-table-column label="是否公开" prop="isPublic" width="50px"></el-table-column>
      <el-table-column label="是否有效" prop="flag" width="50px"></el-table-column>
      <el-table-column label="操作">
           <template slot-scope="scope">
               <el-tooltip class="item" effect="dark" content="更改公开状态" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editIsPublic(scope)"></el-button>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="更改有效状态" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editIsFlag(scope)"></el-button>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-delete" size="mini" @click="removePaper(scope.row.id)"></el-button>
                </el-tooltip>
           </template>
      </el-table-column>
  </el-table>
   <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.start"
       :page-sizes="[1, 2, 5, 10]"
      :page-size="this.queryInfo.size"
      layout="total, sizes, pager, jumper"
      :total="total">
    </el-pagination> 
     
</el-card>
<!-- 添加试卷的对话框 -->
    <el-dialog
        title="试卷"
        :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" 
        ref="addFormRef" 
        label-width="70px" status-icon >
        <el-form-item label="名字" prop="name">
        <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="是否公开" prop="flag">
        <el-input v-model="addForm.flag"></el-input>
        </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPaper">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 试卷详细 -->
    <el-dialog
        title="详细表"
        :visible.sync="paperDialogVisible"
        width="50%" >
        
        <el-table :data="paperDetail" border style="width: 100%">
            <el-table-column fixed prop="name" label="名字" >
            </el-table-column>
            <el-table-column prop="createdBy" label="创建人" >
            </el-table-column>
            <el-table-column prop="score" label="总分" >
            </el-table-column>
            <el-table-column
            fixed="right"
            label="选择题操作">
            <template slot-scope="scope">
                <el-button @click="getQuestions(scope)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
                <el-button @click="emptyQuestions(scope)" type="text" size="small">清空</el-button>
            </template>
            </el-table-column>
        </el-table>


        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="paperDialogVisible = false">确定</el-button>
        </span>
    </el-dialog>

    <!-- 试题详细的对话框 -->
    <el-dialog
        title="试题表"
        :visible.sync="questionDialogVisible"
        width="50%" >
        
        <el-table :data="choiceQuestion" style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="类型:">
            <span>{{ props.row.type }}</span>
          </el-form-item>
          <el-form-item label="科目:">
            <span>{{ props.row.subject }}</span>
          </el-form-item>
          <el-form-item label="题目:">
            <span>{{ props.row.title }}</span>
          </el-form-item>
          <el-form-item label="选项A:">
            <span>{{ props.row.optionA }}</span>
          </el-form-item>
          <el-form-item label="选项B:">
            <span>{{ props.row.optionB }}</span>
          </el-form-item>
          <el-form-item label="选项C:">
            <span>{{ props.row.optionC}}</span>
          </el-form-item>
          <el-form-item label="选项D:">
            <span>{{ props.row.optionD }}</span>
          </el-form-item>
          <el-form-item label="分数:">
            <span>{{ props.row.score }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="题目"
      prop="title">
    </el-table-column>
    <el-table-column
      label="科目"
      prop="subject">
    </el-table-column>
    <el-table-column
            fixed="right"
            label="选择题操作">
            <template slot-scope="scope">
                <el-button @click="delQuestion(scope)" type="text" size="small">删除</el-button>
                
            </template>
            </el-table-column>
  </el-table>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="questionDialogVisible = false">确定</el-button>
        </span>
    </el-dialog>
    <!-- 添加试题 -->
    <el-dialog
        title="试卷"
        :visible.sync="addQuestionDialogVisible"
        width="50%" @close="addQuestionDialogVisible = false"  >
        序号:{{this.paperIdInAddQuestion}}
        名称: {{this.paperName}}
        <el-card>
          <el-table :data="questionList" border stripe>
             <el-table-column type="index"></el-table-column>
            <el-table-column label="科目" prop="subject"></el-table-column>
            <el-table-column label="题目" prop="title"></el-table-column>
            <el-table-column label="选项" prop="content"></el-table-column>
            <el-table-column label="设置分数">
               
               <input v-model="questionScore" placeholder="分数" style="width:50px" />
               
            </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
               <el-tooltip class="item" effect="dark" content="添加到试卷" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="addQuestionToPaper(scope)"></el-button>
                </el-tooltip>
            </template>
      </el-table-column>
          </el-table>
          <el-pagination
          @size-change="questionSizeChange"
          @current-change="questionCurrentChange"
          :current-page="queryQuestion.start"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="this.queryQuestion.size"
          layout="total, sizes, pager, jumper"
          :total="questionTotal">
        </el-pagination>
        </el-card>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addQuestionDialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
    <!-- 发布试卷 -->
    <el-dialog title="选择发布专业"
        :visible.sync="publicPaperDialogVisible"
        width="50%" @close="publicPaperDialogVisible = false">
      <el-select v-model="majorId" placeholder="请选择要发布的专业">
      <el-option
        v-for="item in majorList"
        :key="item.name"
        :label="item.name"
        :value="item.id">
      </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="publicPaperDialogVisible  = false">取 消</el-button>
        <el-button type="primary" @click="assignmentPaper">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>
<script>

export default {
    name:"paperList",
    data(){
        return{
            //获取试卷列表
            queryInfo:{
                query:'',
                start:1,
                size:5
            },
            queryQuestion:{
                query:'',
                start:1,
                size:5
            },
            paperList:[],
            questionList:[],
            majorList:[],
            majorName:'',
            MPaperId:'',
            majorId:'',
            total:0,
            questionTotal:0,
            questionScore:'',
            addDialogVisible:false,
            editDialogVisible:false,
            paperDialogVisible:false,
            questionDialogVisible:false,
            addQuestionDialogVisible:false,
            publicPaperDialogVisible:false,
            addForm:{
                name:'',
                flag:''
            },
            questionForm:{
              paperId:'',
              questionId:'',
              score:'',
              type:'1',
              priority:'1'
            },
            isPublic:'',
            isFlag:'',
            addFormRules:{},
            addQuestionFormRules:{},
            paperDetail:[],
            paperId:'',
            paperName:'',
            paperIdInAddQuestion:'',
    choiceQuestion:[]

        }
    },
    created(){
        this.getPaperList();
    },
    methods:{
        getMajorList(){
            this.axios.get(this.global.baseURL+"/question/getMajor").
            then((response)=>{
              let res = response.data;
              this.majorList = res.object;})
        },
        getPaperList(){
            this.axios.get(this.global.baseURL+"/paper/queryPaper",
       {params:{
               start:this.queryInfo.start,
               size:this.queryInfo.size,
               query:this.queryInfo.query
           }}).then((response)=>{
              let res = response.data;
              if(res.state == 0){
                  return this.$message.error('获取试卷列表失败')
              }
              console.log(res)
              this.paperList = res.object;
              this.total = res.total;
              console.log(this.total)
          })
        },
        handleSizeChange(newSize){
            this.queryInfo.size = newSize;
            this.getPaperList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.start = newPage;
             this.getPaperList();

        },
         queryPaper(){
            if(this.queryInfo.query == ''){
                this.getPaperList()
            }else{
                this.queryInfo.start=1;
                this.getPaperList();
            }
        },
        /*  取消添加框事件*/
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
         /*点击确定 */
        addPaper(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return

                this.axios.get(this.global.baseURL+"/paper/addPaper",{params:{
               name:this.addForm.name,
               flag:this.addForm.flag=='是'?'Y':'N'
           }}).then((response)=>{
                    let res = response.data
                    if(res.state == 0){
                        return this.$message.error('添加试卷失败')
                    }
                    this.addDialogVisible = false;
                    this.queryInfo.start = 1;
                    this.getPaperList();
                    return this.$message.success('添加试卷成功')
                })
            })
        },
        editIsPublic(scope){
            console.log(scope.row)
            this.isPublic = scope.row.isPublic=='Y'?'N':'Y';
            this.axios.get(this.global.baseURL+"/paper/modifyPaperPublicFlag",{params:{
               id:scope.row.id,
               flag:this.isPublic
           }}).then((response)=>{
               let res = response.data
                    if(res.state == 0){
                        return this.$message.error(res.object)
                    }
                    this.getPaperList();
                    return this.$message.success('更改公开状态成功')
           })

        },
        editIsFlag(scope){
            this.isFlag = scope.row.flag=='Y'?'N':'Y';
            this.axios.get(this.global.baseURL+"/paper/modifyPaperFlag",{params:{
               id:scope.row.id,
               flag:this.isFlag
           }}).then((response)=>{
               let res = response.data
                    if(res.state == 0){
                        return this.$message.error(res.object)
                    }
                    this.getPaperList();
                    return this.$message.success('更改有效状态成功')
           })
        },
        publicPaper(scope){
          this.MPaperId = scope.row.id;
          this.publicPaperDialogVisible = true;
          this.getMajorList();
        },
        assignmentPaper(){
          console.log(this.majorId)
          this.axios.get(this.global.baseURL+"/paper/assignmentPaper",{params:{
               pid:this.MPaperId,
               mid:this.majorId
           }}).then((response)=>{
               let res = response.data
                    if(res.state == 0){
                        return this.$message.error(res.object)
                    }
                    this.majorId = '';
                    this.publicPaperDialogVisible = false;
                    return this.$message.success(res.object)
           })
        },
        getPaperDetail(scope){
            this.paperDialogVisible = true;
            this.axios.get(this.global.baseURL+"/paper/paperDetail",{params:{
               id:scope.row.id
               
           }}).then((response)=>{
               let res = response.data
                    if(res.state == 0){
                        this.paperDetail = [];
                        return this.$message.error(res.object)
                    }
                    this.paperDetail = res.object
                    this.paperId=res.object[0].id
                   // console.log(res.object[0])
                    return 
           })
            console.log(scope.row)
        },
        getPaperDetailById(id){
            this.axios.get(this.global.baseURL+"/paper/paperDetail",{params:{
               id:id
               
           }}).then((response)=>{
               let res = response.data
                    if(res.state == 0){
                        this.paperDetail = [];
                        return this.$message.error(res.object)
                    }
                    this.paperDetail = res.object
                    this.paperId=res.object[0].id
                   // console.log(res.object[0])
                    return 
           })
        },
        getQuestions(scope){
                console.log(scope.row)
                this.questionDialogVisible = true;
                this.choiceQuestion = scope.row.choiceQuestion;
                
        },
        delQuestion(scope){
           this.$confirm('此操作将永久删除该张试卷的这道题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.axios.get(this.global.baseURL+"/paper/deleteQuestion",{params:{
                pid:this.paperDetail[0].id,
               qid:scope.row.id
               
           }}).then((response)=>{
                    let res = response.data
                    if(res.state == 0){
                        
                        return this.$message.error(res.object)
                        
                    }
                    this.getPaperDetailById(this.paperDetail[0].id)
                    console.log('现在的试卷详细',this.paperDetail)
                    this.questionDialogVisible = false
                    return this.$message.success('删除成功')
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
        emptyQuestions(scope){
            this.$confirm('此操作将永久清空该张试卷的这道题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.axios.get(this.global.baseURL+"/paper/emptyQuestions",{params:{
                id:scope.row.id
               
           }}).then((response)=>{
                    let res = response.data
                    if(res.state == 0){
                        
                        return this.$message.error(res.object)
                        
                    }
                    this.getPaperDetail(scope)
                    console.log('现在的试卷详细',this.paperDetail)
                    
                    return this.$message.success('清空成功')
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清空'
          });          
        });
        },
        showAddQuestion(scope){
          this.addQuestionDialogVisible = true;
          this.queryQuestions();
          this.paperName = scope.row.name;
          this.paperIdInAddQuestion = scope.row.id;
        },
        queryQuestions(){
          this.axios.get(this.global.baseURL+"/question/queryQuestions",
          {params:{
               start:this.queryQuestion.start,
               size:this.queryQuestion.size,
               query:this.queryQuestion.query
           }}).then((response)=>{
              let res = response.data;
              if(res.state == 0){
                  return this.$message.error('res.object')
              }
              console.log(res)
              this.questionList = res.object;
              this.questionTotal = res.total;
              console.log(this.total)
          })
        },
         questionSizeChange(newSize){
            this.queryQuestion.size = newSize;
            this.queryQuestions();
        },
        questionCurrentChange(newPage){
            this.queryQuestion.start = newPage;
             this.queryQuestions();

        },
        addQuestionToPaper(scope){
          if(this.questionScore==''){
            this.$message.error("请设置一个分数");
            return;
          }
          this.questionForm.paperId = this.paperIdInAddQuestion;
          this.questionForm.questionId = scope.row.id;
          console.log(scope.row)
          this.questionForm.score = this.questionScore;
           this.axios.post(this.global.baseURL+"/paper/compositionPaper",this.questionForm
          ).then((response)=>{
              let res = response.data;
              if(res.state == 0){
                  return this.$message.error(res.object)
              }else{
                 this.questionScore = '';
                return this.$message.success(res.object)
              }
              
             
              
          })


        
        },
        
        

    }
}
</script>
<style lang="less" scoped>
    demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>