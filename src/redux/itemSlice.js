import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk("item/fetchData", async () => {
  const response = fetch("https://randomuser.me/api/")
    .then((data) => data.json())
    .then((responseData) => {
      return responseData?.results.map((itm) => ({
        id: itm.login.uuid,
        dob: itm.dob.date.slice(0, 10),
        username: itm.login.username,
        password: itm.login.password,
        fname: itm.name.first,
        lname: itm.name.last,
        email: itm.email,
        phone: itm.phone,
        city: itm.location.city,
        country: itm.location.country,
        image: itm.picture.large,
      }));
    });
  return response;
});

const itemSlice = createSlice({
  name: "totalItems",
  initialState: {
    id: "",
    dob: "",
    username: "",
    password: "",
    fname: "",
    lname: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    image: "",
    items: [],
    isEdit: false,
    isLoading: false,
    errorMessage: "",
  },
  reducers: {
    inputChange: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },

    submit: (state, action) => {
      state.items = [action.payload, ...state.items];
    },
    getUser: () => {},
    fetcher: (state, action) => {
      state.items = [...action.payload, ...state.items];
    },
    edit: (state, action) => {
      state.isEdit = true;
      state.id = action.payload.id;
      state.fname = action.payload.fname;
      state.lname = action.payload.lname;
      state.phone = action.payload.phone;
      state.email = action.payload.email;
      state.image = action.payload.image;
    },
    update: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              fname: state.fname,
              lname: state.lname,
              phone: state.phone,
              email: state.email,
              image: state.image,
            }
          : item
      );
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    clearForm: (state) => {
      state.username = "";
      state.password = "";
      state.fname = "";
      state.lname = "";
      state.dob = "";
      state.email = "";
      state.phone = "";
      state.city = "";
      state.country = "";
      state.image = "";
      state.isEdit = false;
    },
    dataLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    errors: (state, action) => {
      state.errorMessage = action.payload;
    },
  },
  extraReducers: {
    [fetchData.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchData.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.items = [...action.payload, ...state.items];
      // state.items = action.payload.concat(state.items);
    },
    [fetchData.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  inputChange,
  submit,
  getUser,
  fetcher,
  edit,
  update,
  deleteItem,
  clearForm,
  dataLoader,
  errors,
} = itemSlice.actions;
export default itemSlice.reducer;
