import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const ITEMAPI_URL = `${BASE_URL}/api/items/`;

export const fetchAllItems = createAsyncThunk(
  'items/fetchAllItems',
  async () => {
    const response = await axios.get(ITEMAPI_URL);
    return response.data;
  }
);

export const fetchItemsBySellerId = createAsyncThunk(
  'items/fetchItemsBySellerId',
  async (sellerId) => {
    const response = await axios.get(`${ITEMAPI_URL}seller/${sellerId}`);
    return response.data;
  }
);

export const fetchItemById = createAsyncThunk(
  'items/fetchItemById',
  async (id) => {
    const response = await axios.get(`${ITEMAPI_URL}${id}`);
    return response.data;
  }
);

export const createItem = createAsyncThunk(
  'items/createItem',
  async (itemData) => {
    let dataToSend = itemData;

    if (itemData.image instanceof File) {
      const formData = new FormData();
      formData.append('name', itemData.name);
      formData.append('sellerId', itemData.sellerId);
      formData.append('category', itemData.category);
      formData.append('description', itemData.description);
      formData.append('price', itemData.price);
      formData.append('status', itemData.status);
      formData.append('image', itemData.image);

      dataToSend = formData;
    }

    const response = await axios.post(ITEMAPI_URL, dataToSend);
    return response.data;
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, itemData }) => {
    let dataToSend = itemData;

    if (itemData.image instanceof File) {
      const formData = new FormData();
      formData.append('name', itemData.name);
      formData.append('sellerId', itemData.sellerId);
      formData.append('category', itemData.category);
      formData.append('description', itemData.description);
      formData.append('price', itemData.price);
      formData.append('status', itemData.status);
      formData.append('image', itemData.image);

      dataToSend = formData;
    }

    const response = await axios.put(`${ITEMAPI_URL}${id}`, dataToSend);
    return response.data;
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id) => {
    await axios.delete(`${ITEMAPI_URL}${id}`);
    return id;
  }
);


const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    item: null,        
    status: 'idle',
    error: null,
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchAllItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchItemsBySellerId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItemsBySellerId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchItemsBySellerId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchItemById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.item = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(createItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      .addCase(updateItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.item?._id === action.payload._id) {
          state.item = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(deleteItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );
        if (state.item?._id === action.payload) {
          state.item = null;
        }
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default itemsSlice.reducer;
