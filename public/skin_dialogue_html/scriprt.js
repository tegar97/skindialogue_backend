   const API_URL = 'https://dev-api.skindialogue.id/';
   let PAGE_PRODUCTS = 1,
      EL_LIST_PRODUCTS = '#products-list',
      SEARCH_PRODUCTS = '#products-products'

      
   function generateListProduct(data) {
     let template = `
      <div class="col-md-4 col-6 mb-4 mb-sm-4">
        <div class="card flex-column justify-content-center align-items-center">
          <a href="#" class="w-100">
            <img style="width: 100%; height: auto" src="https://dev-api.skindialogue.id/storage/${data.main_photo.file}"/></a>
             <a href="#" class="mb-1 pt-4 text-body small font-weight-bold category-name">${data.category.name}</a>
              <a href="#" class="product-link font-size-1">${data.name}</a>
               <span class="font-weight-bold mt-3 mb-1">IDR ${data.price}</span>
                <span class="font-weight-bold price-retail mb-4">
                <span class="font-weight-normal font-size-small">Reseller</span> IDR ${data.price_retail}
             <span class="font-weight-normal font-size-small"> + Point</span>
           </span>
         </div>
       </div>
     `;

     return template;
   }

   function tampilkanProducts (){
     $.ajax({
         url: `${API_URL}api/v1/public/products?page=${PAGE_PRODUCTS}`,
         dataType: 'json',
         success: function(res) {
           for(let i = 0; i < res.data.length; i++) {
             $(EL_LIST_PRODUCTS).append(generateListProduct(res.data[i]));
             console.log(res)
             
           }
         }
     });
  }
  
  tampilkanProducts();



$('#search-products').on('keyups', function(){
    $('#products-list').html('');
      let searchField = $('#search-products').val();
      let expression = new RegExp(searchField, 'i');
        $.ajax({
          url: `${API_URL}api/v1/public/products?page=${PAGE_PRODUCTS}`,
          dataType: 'json',
          success: function(data) {
           $.each(data, function (key, value){
             if(value.name.search(expression) != -1 || value.location.search(expression) != -1){

             }
             $('#products-list').append(generateListProduct(res.data[i]));
           });
              
          }
      });
});


function generateListCategory(){
  let template = `<a href="/products/paket-perawatan-wajah" class="font-size-small dropdown-nav-link font-weight-bold d-flex " 
  role="button" aria-expanded="false" aria-controls="sidebarNav1Collapse" 
  data-target="#paket-perawatan-wajahNav">Paket Perawatan Wajah<span class="ml-auto badge border badge-pill ml-2">18</span></a>`



  return template;
}






let EL_LIST_CATEGORY = 'product-category',
    COUNT_CATEGORY = 1;



  //   function tampilkanListCategory (){
  //     $.ajax({
  //         url: `${API_URL}api/v1/public/product_categories?page=${PAGE_PRODUCTS}`,
  //         dataType: 'json',
  //         success: function(res) {
  //           for(let i = 0; i < res.data.length; i++) {
  //            $(EL_LIST_PRODUCTS).append(generateListCategory(res.data[i]));
  //             console.log(res)
              
  //           }
  //         }
  //     });
  //  }
 
  //  tampilkanListCategory();
