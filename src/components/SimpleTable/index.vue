<template>
  <div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="listData.list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" align="center" width="80" />
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :label="item.label || 'label'"
        :type="item.type"
        :align="item.align || 'center'"
        :width="item.width"
        :min-width="item['min-width'] || item.width"
      >
        <template slot-scope="{ row }">
          <span v-text="row[item.field]"></span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="listData.total > 0"
      :total="listData.total"
      :page.sync="listData.page"
      :limit.sync="listData.size"
      @pagination="pagination"
    />
  </div>
</template>

<script>
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
      paginationParams: {
        page: 1,
        size: 10,
        total: 0
      }
    };
  },
  methods: {},
  props: {
    /** Table Columns */
    columns: {
      type: Array,
      default: []
    },
    /** table data */
    listData: {
      type: Object,
      default: {
        size: 10,
        page: 1,
        total: 0,
        list: []
      }
    },
    pagination: {
      type: Function,
      default: function({ page, limit }) {
        console.log(page + "----" + limit);
      }
    },
    listLoading:{
      type:Boolean,
      default:false
    }
  }
};
</script>
