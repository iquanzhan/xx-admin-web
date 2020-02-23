<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.userName"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.nickName"
        placeholder="姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.telephone"
        placeholder="手机号码"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.email"
        placeholder="电子邮箱"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" align="center" width="80" />
      <el-table-column label="用户名" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="90px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sex == 1 ? "男" : "女" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" width="130px" align="center">
        <template slot-scope="{ row }">
          <span>{{ $moment(row.birthday).format("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号码" width="130px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电子邮箱" width="180px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.descript }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否锁定" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.locked | statusFilter">
            {{ row.locked == 0 ? "否" : "是" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.deleteStatus | statusFilter">
            {{ row.deleteStatus == 0 ? "正常" : "已删除" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button size="mini">
            查看
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.deleteStatus != 1"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="temp.nickName" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <template>
            <el-radio-group v-model="temp.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="temp.birthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="telephone">
          <el-input v-model="temp.telephone" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input
            v-model="temp.descript"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createUser, updateUser, deleteUser } from "@/api/sysuser";
import waves from "@/directive/waves";
import Pagination from "@/components/Pagination";

export default {
  name: "SysUser",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "success",
        1: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        sortName: "createTime",
        sortOrder: "desc"
      },
      statusOptions: ["published", "draft", "deleted"],
      temp: {
        id: undefined,
        userName: "",
        nickName: "",
        sex: 1,
        birthday: new Date(),
        telephone: "",
        email: "",
        address: "",
        descript: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑用户",
        create: "添加用户"
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        telephone: [
          {
            type: "string",
            pattern: /1\d{10}/,
            trigger: "blur",
            message: "请输入正确的手机号码"
          }
        ],
        email: [
          {
            type: "email",
            trigger: "blur",
            message: "请输入正确的电子邮箱"
          }
        ]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**获取列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listQuery.page = response.data.pageNumber;
        this.listQuery.size = response.data.pageSize;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    /**执行查询 */
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    /**重置Model数据，添加修改时使用 */
    resetTemp() {
      this.temp = {
        id: undefined,
        userName: "",
        nickName: "",
        sex: 1,
        birthday: new Date(),
        telephone: "",
        email: "",
        address: "",
        descript: ""
      };
    },
    /**点击创建时，弹框 */
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    /**发送请求执行创建 */
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createUser(this.temp).then(data => {
            this.list.unshift(data.data);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    /**点击编辑时，弹框 */
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    /**发送请求执行编辑 */
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateUser(tempData).then(data => {
            let temp = data.data;
            const index = this.list.findIndex(v => v.id === temp.id);
            this.list.splice(index, 1, temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    /**执行删除 */
    handleDelete(row, index) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(row.id).then(data => {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
            this.list.splice(index, 1);
          });
        })
        .catch(() => {});
    }
  }
};
</script>
