<template>
  <q-page style="width: 70%; margin: auto">
    <div class="q-ma-xl">
      <div class="text-h6">Grzegorz Gajda</div>
      <div class="text-subtitle2">Project for STX Next</div>
      <q-linear-progress :indeterminate="progress" instant-feedback />

      <div class="q-my-xl">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md" style="width: 350px">
          <div class="q-gutter-sm">
            <q-radio checked-icon="task_alt" v-model="field" val="title" label="title" />
            <q-radio checked-icon="task_alt" v-model="field" val="author" label="author" />
            <q-radio checked-icon="task_alt" v-model="field" val="subject" label="subject" />
          </div>
          <q-input
            filled
            v-model="keys"
            :label="field"
            :hint="hint"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'The filed can\'t be empty!']"
          />

          <q-select
            :disable="rows.length > 0 ? false : true"
            filled
            v-model="language"
            :options="selectLang"
            label="select language"
          />

          <div>
            <q-btn label="search" type="submit" color="primary" />
            <q-btn label="clear" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </div>

      <q-table
        v-show="rows.length > 0"
        title="Treats"
        dense
        :rows="rows"
        :columns="columns"
        row-key="name"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const progress = ref(false);
const field = ref("title");

const keys = ref(null),
  hint = computed(
    () => `Fill in a ${field.value} of a book which want to find down.`
  );

const language = ref(null),
  selectLang = computed(() => {
    const langArray = rows.value.map((v) => v.language);
    return langArray
      .filter((item, index) => langArray.indexOf(item) === index)
      .sort();
  });
const rows = ref([]);

const notifyWarning = (text) => {
  $q.notify({
    type: "warning",
    message: text,
  });
};

const notifyError = (text) => {
  $q.notify({
    type: "negative",
    message: text,
  });
};

const columns = [
  {
    name: "cover",
    align: "center",
    label: "Book cover",
    field: "cover",
    format: (val) => <img style="width: 70px" src={val} />,
    style: "width: 128px",
  },
  {
    name: "title",
    align: "left",
    label: "Title",
    field: "title",
    sortable: true,
    style: "color: grey; font-size: 16px; width: 256px",
  },
  {
    name: "description",
    align: "left",
    label: "Short desctription",
    field: "description",
    style: "color: grey; font-size: 14px; width: 480px",
  },
];

const descLength = (val) => {
  let descArray = [];

  if (val) {
    descArray = val.split(" ");
    val = "";

    for (let i = 0; i < 19; i++) {
      val += " " + descArray[i];
    }
    return (val += "...");
  }
};

const onSubmit = () => {
  progress.value = !progress.value;
  const query = `${
    field.value !== "subject" ? "in" + field.value : field.value
  }:${keys.value}`;
  const url = `${process.env.VUE_APP_URL}?q=${query}&maxResults=40&langRestrict=${language.value}`;

  axios
    .get(url)
    .then((response) => {
      //console.log(response.data.items);
      rows.value = [];
      if (response.data.totalItems > 0) {
        response.data.items.forEach((item) => {
          rows.value.push({
            cover: item.volumeInfo.imageLinks
              ? item.volumeInfo.imageLinks.thumbnail
              : "https://upload.wikimedia.org/wikipedia/commons/b/b9/No_Cover.jpg",
            title: item.volumeInfo.title,
            description: descLength(item.volumeInfo.description),
            language: item.volumeInfo.language,
          });
        });
      } else {
        if (!rows.value.length) {
          notifyWarning(`There isn't any results for keyword: ${keys.value}.`);
        }
      }
    })
    .catch((error) => {
      notifyError(`${error}`);
    })
    .then(() => {
      progress.value = !progress.value;
    });
};

const onReset = () => {
  keys.value = null;
  language.value = null;
  rows.value = [];
};
</script>

<style>
.til {
  width: 200px;
  font-size: 34px;
}
</style>