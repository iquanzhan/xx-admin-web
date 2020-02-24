<template>
  <div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :label="item.label || 'label'"
        :type="item.type"
        :align="item.align || 'center'"
        :width="item.width || 80"
        :min-width="item['min-width'] || item.width"
        {{{...item}}}
      >
        <template v-if="item.customContent">
          
        </template>
      </el-table-column>

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
      <el-table-column label="性别" width="90p" align="center">
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
  </div>
</template>

<script>
import { fetchList, createUser, updateUser, deleteUser } from "@/api/sysuser";
import waves from "@/directive/waves";
import Pagination from "@/components/Pagination";

export default {
  name: "SimpleTable",
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        size: 10,
        sortName: "createTime",
        sortOrder: "desc"
      }
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
    }
  },
  props: {
    /** Table Columns */
    columns: {
      type: Array,
      default: []
    }
  }
};
</script>
