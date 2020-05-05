<template>
  <div class="app-container">
    <el-form
      ref="role"
      :model="role"
      :rules="validateRules"
      label-width="120px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="role.roleName" />
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import roleApi from "@/api/acl/role";

const defaultForm = {
  roleName: ""
};

export default {
  data() {
    return {
      role: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用,
      validateRules: {
        roleName: [
          { required: true, trigger: "blur", message: "角色名必须输入" }
        ]
      }
    };
  },
  watch: {
    $route(to, from) {
      console.log(to);
      console.log(from);
      this.init();
    }
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.fetchDataById(id);
      } else {
        this.role = { ...defaultForm };
      }
    },

    saveOrUpdate() {
      this.$refs.role.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true; // 防止表单重复提交
          if (!this.role.id) {
            this.saveData();
          } else {
            this.updateData();
          }
        }
      });
    },

    // 新增角色
    saveData() {
      roleApi.save(this.role).then(response => {
        this.$message({
          type: "success",
          message: "角色信息添加成功"
        });
        this.$router.push({ path: "/role/list" });
      });
    },

    // 根据id更新记录
    updateData() {
      // teacher数据的获取
      roleApi.updateById(this.role).then(response => {
        this.$message({
          type: "success",
          message: "角色信息修改成功"
        });
        this.$router.push({ path: "/role/list" });
      });
    },

    // 根据id查询记录
    fetchDataById(id) {
      roleApi.getById(id).then(response => {
        this.role = response.data;
      });
    }
  }
};
</script>
