<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.roleKey"
        placeholder="角色KEY"
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
      <el-table-column label="名称" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色KEY" width="230px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.roleKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="130px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述信息" width="300px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.descript }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button size="mini" @click="showDetailDialog(row)">
            查看
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="warning"
            @click="dispatchRole(row, $index)"
          >
            角色
          </el-button>
          <el-button
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
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色KEY" prop="roleKey">
          <el-input v-model="temp.roleKey" placeholder="请输入角色KEY" />
        </el-form-item>
        <el-form-item label="父角色" prop="parentId">
          <selectTree
            :props="{
              value: 'id'
            }"
            :options="[
              {
                id: '1',
                label: '123456',
                children: [{ id: '2', label: '236985', children: [] }]
              }
            ]"
            :value="treeSelectRole"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" placeholder="请输入排序" />
        </el-form-item>

        <el-form-item label="描述信息" prop="descript">
          <el-input
            v-model="temp.descript"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入描述信息"
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

    <el-dialog title="分配角色" width="30%" :visible.sync="dispatchRoleVisible">
      <div>
        <h4>为【<span v-text="currentRow.userName"></span>】分配角色</h4>
        <el-tree
          :data="roleTree"
          :default-expand-all="true"
          show-checkbox
          node-key="id"
          :default-checked-keys="userRole"
          :props="{ label: 'name' }"
          ref="treeRole"
        >
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dispatchRoleVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dispatchUserRole">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色信息" :visible.sync="dialogDetailVisible">
      <div>
        <el-form label-width="100px" label-suffix="：">
          <el-form-item label="角色名">
            <span v-text="detailRole.name"></span>
          </el-form-item>
          <el-form-item label="角色KEY">
            <span v-text="detailRole.roleKey"></span>
          </el-form-item>
          <el-form-item label="父角色信息">
            <span v-text="detailRole.parentId"></span>
          </el-form-item>
          <el-form-item label="排序">
            <span v-text="detailRole.sort"></span>
          </el-form-item>
          <el-form-item label="描述信息">
            <span v-text="detailRole.descript"></span>
          </el-form-item>
          <el-form-item label="创建时间">
            <span v-text="detailRole.createTime"></span>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createUser,
  updateUser,
  deleteUser,
  dispatchRole
} from "@/api/sysuser";
import {
  fetchList,
  getDetails,
  getRoles,
  getRoleByUserId,
  getTreeRoles
} from "@/api/sysrole";
import SelectTree from "@/components/SelectTree";
import waves from "@/directive/waves";
import Pagination from "@/components/Pagination";

export default {
  name: "SysRole",
  components: { Pagination, SelectTree },
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
        name: "",
        roleKey: "",
        descript: "",
        parentId: "",
        sort: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑用户",
        create: "添加用户"
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        roleKey: [
          {
            required: true,
            trigger: "blur",
            message: "请输入正确的角色KEY"
          }
        ]
      },
      currentRow: {},
      dispatchRoleVisible: false,
      //分类角色相关
      roleTree: [],
      userRole: [],
      /**用户详情Model */
      detailRole: {},
      dialogDetailVisible: false,
      treeSelectRole: "2"
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**格式化出生日期 */
    birthday(dateText) {
      return this.$moment(dateText).format("YYYY-MM-DD");
    },
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
    },
    /**分配角色 */
    dispatchRole(row, index) {
      //置空用户角色
      this.userRole = [];
      this.currentRow = {};

      this.currentRow = row;
      //查询树形角色信息
      getTreeRoles().then(data => {
        if (data.data) {
          this.roleTree = [data.data];
        }
      });
      getRoleByUserId(this.currentRow.id).then(data => {
        if (data.data) {
          this.userRole = data.data.map((item, index) => {
            return item.id;
          });
        }
      });

      //弹窗设置为显示
      this.dispatchRoleVisible = true;
    },
    /**执行分配角色 */
    dispatchUserRole() {
      dispatchRole(
        this.currentRow.id,
        this.$refs.treeRole.getCheckedKeys()
      ).then(data => {
        this.$notify({
          title: "成功",
          message: "分配角色成功",
          type: "success",
          duration: 2000
        });
        this.dispatchRoleVisible = false;
      });
    },
    //显示详情信息
    showDetailDialog(row) {
      this.detailRole = {};
      getDetails(row.id).then(data => {
        this.detailRole = data.data;
        this.dialogDetailVisible = true;
      });
    }
  }
};
</script>
