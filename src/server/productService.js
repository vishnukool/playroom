const axios = require("axios").default;
const {TARGET_SEARCH_URL, WAYFAIR_SEARCH_URL, HEADER_WAYFAIR_RAPID_API_HOST, RESULTS_PER_PAGE, TARGET_STORE_ID, TARGET_CATEGORY_KEY, HEADER_TARGET_RAPID_API_HOST, HEADER_RAPID_API_KEY} = require("./constants")

async function getTargetProducts(query, page) {

  var options = {
    method: 'GET',
    url: TARGET_SEARCH_URL,
    params: {
      store_id: TARGET_STORE_ID,
      category: TARGET_CATEGORY_KEY,
      keyword: query,
      count: RESULTS_PER_PAGE,
      offset: page,
      default_purchasability_filter: 'true',
      sort_by: 'relevance'
    },
    headers: {
      'x-rapidapi-host': HEADER_TARGET_RAPID_API_HOST,
      'x-rapidapi-key': HEADER_RAPID_API_KEY
    }
  };

  const response = await axios.request(options)
  //todo: I don't like these cascading defensive checks either, but the API seems to randomly have null & undefined values here. So here we are making it work!
  let productCollection = response.data.data && response.data.data.search && response.data.data.search.products ? response.data.data.search : [];
  let products = productCollection.products.map(p => {
    return {
      vendor: "TARGET",
      price: p.price.current_retail,
      description: p.item.product_description.title,
      hasStock: p.fulfillment.shipping_options.availability_status === "IN_STOCK",
      imageUrl: p.item.enrichment.images.primary_image_url,
      productUrl: p.item.enrichment.buy_url
    }
  });
  return products
}

async function getWayfairProducts(query, page) {
  var options = {
    method: 'GET',
    url: WAYFAIR_SEARCH_URL,
    params: {keyword: query, sortby: '0', curpage: page, itemsperpage: RESULTS_PER_PAGE},
    headers: {
      'x-rapidapi-host': HEADER_WAYFAIR_RAPID_API_HOST,
      'x-rapidapi-key': HEADER_RAPID_API_KEY
    }
  };

  const response = await axios.request(options)
  let productCollection = response.data.response.superbrowse_object ? response.data.response.superbrowse_object.product_collection : response.data.response.product_collection;
  let products = productCollection.map(p => {
    return {
      vendor: "WAYFAIR",
      price: p.sale_price,
      description: p.name,
      hasStock: p.has_stock,
      imageUrl: p.image_url,
      productUrl: p.product_url
    }
  });
  return products
}

module.exports.getProducts = async (query, page) => {
  const targetProducts = await getTargetProducts(query, page);
  const wayfairProducts = await getWayfairProducts(query, page);
  return interLeaveArrays(targetProducts, wayfairProducts);
};

//Simple way of mixing alternating results.
const interLeaveArrays = ([x, ...xs], ys = []) =>
  x === undefined ? ys : [x, ...interLeaveArrays(ys, xs)]