<template>
  <div class="home">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240); font-size: 40px"
      title="To-Do"
      sub-title="Complete your daily Tasks!"
    />
    <a-input
      placeholder="Enter Task"
      size="large"
      v-model="task"
      class="task"
    />
    <a-time-picker use12-hours format="h:mm a" @change="onChange" class="eta" />
    <a-button type="primary" @click="addTask" class="submit">
      Submit Task
    </a-button>
    <a-table
      :columns="columns"
      :dataSource="data"
      :rowSelection="{ onSelect: onSelectChange }"
      style="width: 100vw ; background-color: white"
    >
      <template slot="task" slot-scope="text, record">
        <editable-cell
          :text="text"
          @change="onCellChange(record, 'task', $event)"
        />
      </template>
      <span slot="status" slot-scope="status">
        <a-tag
          :color="
            status === 'Incomplete'
              ? 'volcano'
              : status === 'Complete'
              ? 'geekblue'
              : 'green'
          "
        >
          {{ status.toUpperCase() }}
        </a-tag>
      </span>
      <template slot="delete" slot-scope="text, record">
        <a-popconfirm
          v-if="data.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record)"
        >
          <a href="javascript:;">Delete</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
import firebase from "../firebaseConfig.js";
import {
  addDoc,
  getDocs,
  collection,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import EditableCell from "../components/editCell.vue";

const columns = [
  {
    title: "Task",
    dataIndex: "task",
    key: "task",
    scopedSlots: { customRender: "task" },
  },
  {
    title: "Created",
    dataIndex: "Created",
    key: "Created",
  },
  {
    title: "ETA",
    dataIndex: "ETA",
    key: "ETA",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "Delete",
    dataIndex: "delete",
    key: "delete",
    slots: { title: "delete" },
    scopedSlots: { customRender: "delete" },
  },
];

export default {
  components: {
    EditableCell,
  },
  data() {
    return {
      data: [],
      columns,
      task: "",
      eta: "",
      deadline: "",
      timestamp: "",
      status: "Incomplete",
    };
  },
  beforeMount() {
    const task = collection(firebase.db, "tasks");
    getDocs(task).then((response) => {
      const docs = response.docs;
      this.data = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(this.data);
    });
  },
  created() {
    setInterval(this.getNow, 1000);
  },
  methods: {
    async addTask() {
      const docRef = await addDoc(collection(firebase.db, "tasks"), {
        task: this.task,
        ETA: this.eta,
        Created: this.timestamp,
        status: this.status,
      });
      console.log("Document written with ID: ", docRef.id);
      this.data.push({
        task: this.task,
        ETA: this.eta,
        Created: this.timestamp,
        status: this.status,
      });
      this.task = "";
      this.eta = "";
    },
    onChange(time, timeString) {
      this.eta = timeString;
    },
    getNow: function() {
      const today = new Date();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.timestamp = time;
    },
    async onSelectChange(e) {
      try {
        var index = this.data.indexOf(e);
        this.data[index].status =
          this.data[index].status == "Completed" ? "Incomplete" : "Completed";
        await updateDoc(doc(firebase.db, "tasks", this.data[index].id), {
          status: this.data[index].status,
        });
      } catch (e) {
        console.log("ERRORRR", e);
      }
    },

    async onCellChange(key, dataIndex, value) {
      const data = [...this.data];
      const target = data.find((item) => item.id === key.id);
      if (target) {
        target[dataIndex] = value;
        this.data = data;
      }
      await updateDoc(doc(firebase.db, "tasks", key.id), {
        task: value,
      });
    },
    async onDelete(key) {
      console.log(key);
      const data = [...this.data];
      this.data = data.filter((item) => item.task !== key.task);
      await deleteDoc(doc(firebase.db, "tasks", key.id));
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #eee;
}
.task {
  max-width: 60%;
  margin-top: 5vh;
  margin-bottom: 2vh;
}
.eta {
  margin-bottom: 2vh;
}
.submit {
  margin-bottom: 5vh;
}
</style>
