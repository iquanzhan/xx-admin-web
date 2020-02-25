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
            @click="dispatchUser(row, $index)"
          >
            用户
          </el-button>
          <el-button
            size="mini"
            type="warning"
            @click="dispatchResource(row, $index)"
          >
            资源
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
          <el-input
            v-model="temp.roleKey"
            placeholder="请输入角色KEY"
            :disabled="dialogStatus == 'update'"
          />
        </el-form-item>
        <el-form-item label="父角色" prop="parentId">
          <selectTree
            :props="{
              value: 'id',
              label: 'name'
            }"
            :options="roleTree"
            :value="temp.parentId"
            :accordion="true"
            placeholder="请选择角色信息"
            @getValue="
              obj => {
                temp.parentId = obj;
              }
            "
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="temp.sort"
            :min="1"
            label="请输入排序"
          ></el-input-number>
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

    <el-dialog title="分配用户" width="30%" :visible.sync="dispatchUserVisible">
      <div>
        <h4>为【<span v-text="currentRow.name"></span>】分配用户</h4>
        <el-checkbox-group v-model="userRole">
          <el-checkbox
            v-for="(item, index) in userList"
            :label="item.id"
            :key="index"
          >
            {{ "用户名：" + item.userName + "，" + "姓名：" + item.nickName }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dispatchUserVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dispatchRoleUser">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配资源" width="30%" :visible.sync="dispatchResourceVisible">
      <div>
        <h4>为【<span v-text="currentRow.name"></span>】分配资源</h4>
        <el-tree
          :data="resourceTreeList"
          :default-expand-all="true"
          show-checkbox
          node-key="id"
          :default-checked-keys="roleResource"
          :props="{ label: 'name' }"
          ref="treeResource"
        >
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dispatchResourceVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dispatchRoleResource">
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
          <el-form-item label="所属父角色">
            <span v-text="detailParentRole.name"></span>
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
import { dispatchRole, getUserByRoleId, getUsers } from "@/api/sysuser";
import {
  fetchList,
  getDetails,
  getRoles,
  getRoleByUserId,
  getTreeRoles,
  createRole,
  updateRole,
  deleteRole,
  dispatchUser,
  dispatchResource
} from "@/api/sysrole";
import { getResourceByRoleId ,getTreeResource} from "@/api/sysresource";

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
        update: "编辑角色",
        create: "添加角色"
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
      dispatchUserVisible: false,
      //分类角色相关
      roleTree: [],
      userRole: [],
      /**用户详情Model */
      detailRole: {},
      dialogDetailVisible: false,
      treeSelectRole: "2",
      /**详情内的父角色信息 */
      detailParentRole: {},
      /**用户列表 */
      userList: [],
      /**分配资源相关 */
      dispatchResourceVisible:false,
      roleResource: [],
      //资源树信息
      resourceTreeList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**获取用户信息列表 */
    getUsers() {
      getUsers().then(data => {
        if (data.data) {
          this.userList = data.data;
        }
      });
    },
    //查询树形角色信息
    getTreeRoles() {
      getTreeRoles().then(data => {
        if (data.data) {
          this.roleTree = [data.data];
        }
      });
    },
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
        name: "",
        roleKey: "",
        descript: "",
        parentId: "",
        sort: ""
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
      //获取角色树信息
      this.getTreeRoles();
    },
    /**发送请求执行创建 */
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createRole(this.temp).then(data => {
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
      //获取角色树信息
      this.getTreeRoles();
    },
    /**发送请求执行编辑 */
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateRole(tempData).then(data => {
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
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole(row.id).then(data => {
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
    /**分配用户信息 */
    dispatchUser(row, index) {
      //置空角色用户
      this.userRole = [];
      this.currentRow = {};

      this.currentRow = row;

      /**获取用户信息 */
      this.getUsers();

      getUserByRoleId(this.currentRow.id).then(data => {
        if (data.data) {
          this.userRole = data.data.map((item, index) => {
            return item.id;
          });
        }
      });

      //弹窗设置为显示
      this.dispatchUserVisible = true;
    },
    /**执行分配角色 */
    dispatchRoleUser() {
      dispatchUser(this.currentRow.id, this.userRole).then(data => {
        this.$notify({
          title: "成功",
          message: "分配用户成功",
          type: "success",
          duration: 2000
        });
        this.dispatchUserVisible = false;
      });
    },
    /**分配资源 */
    dispatchResource(row, index) {
      //置空角色用户
      this.roleResource = [];
      this.currentRow = {};

      this.currentRow = row;

      //查询树形资源信息
      getTreeResource().then(data => {
        if (data.data) {
          this.resourceTreeList = [data.data];
        }
      });
      getResourceByRoleId(this.currentRow.id).then(data => {
        if (data.data) {
          this.roleResource = data.data.map((item, index) => {
            return item.id;
          });
        }
      });

      //弹窗设置为显示
      this.dispatchResourceVisible = true;
    },
    //执行分配资源
    dispatchRoleResource(){
       dispatchResource(
        this.currentRow.id,
        this.$refs.treeResource.getCheckedKeys()
      ).then(data => {
        this.$notify({
          title: "成功",
          message: "分配资源成功",
          type: "success",
          duration: 2000
        });
        this.dispatchResourceVisible = false;
      });
    },
    //显示详情信息
    showDetailDialog(row) {
      this.detailRole = {};
      getDetails(row.id).then(data => {
        this.detailRole = data.data;
        this.dialogDetailVisible = true;
        let parentId = this.detailRole.parentId;
        if (parentId == "0") {
          this.detailParentRole = { id: 0, name: "根节点" };
        } else {
          getDetails(parentId).then(data => {
            this.detailParentRole = data.data;
          });
        }
      });
    }
  }
};
</script>
