

$("#btn_add").click(function (e) {
  //verification

   if ($("#txtShopName").val().trim().length < 1) {
    alert("Please Enter Shop Name");
    $("#txtShopName").focus();
    return false;
  }

  if ($("#txtName").val().trim().length < 1) {
    alert("Please Enter Name");
    $("#txtName").focus();
    return false;
  }



  if ($("#txtMobileNo").val().trim().length < 10) {
    alert("Please Enter 10 Digits of Mobile Number");
    $("#txtMobileNo").focus();
    return false;
  }

  if ($("#txtPassword").val().trim().length < 1) {
    alert("Please Enter Password");
    $("#txtPassword").focus();
    return false;
  }

  if ($("#selRole").val().trim().length < 1) {
    alert("Please Select Role");
    $("#selRole").focus();
    return false;
  }


  $.ajax({
    beforeSend: function () {
      $(".btn .spinner-border").show();
      $("#btn_add").attr("disabled", true);
    },
    url: "/insert_post_wholesaler",
    type: "POST",
    data: {
          txtShopName: $("#txtShopName").val(),
          txtName: $("#txtName").val(),
          txtEmail: $("#txtEmail").val(),
          txtMobileNo: $("#txtMobileNo").val(),
          txtPassword: $("#txtPassword").val(),
          selRole: $("#selRole").val()
    },
    success: function (result) {
      alert("Wholesaler Added Succesfully");
      location.reload();
      
    },
    error: function (request, error) {
      console.error(error);
    },
    complete: function () {
      $(".btn .spinner-border").hide();
      $("#btn_add").attr("disabled", false);
    },
  });
});

// ADD Testimnials data Table (DONE)
$(document).ready(function () {

  // $(window).on("load", function () {
    getAdminData();
  // });

  //Edit modal submit click
  $(document).on("click", "#btn_update", function () {

    if ($("#txtShopName1").val().trim().length < 1) {
        alert("Please Enter Shop Name");
        $("#txtShopName1").focus();
        return false;
    }

    if ($("#txtName1").val().trim().length < 1) {
        alert("Please Enter Name");
        $("#txtName1").focus();
        return false;
    }


    if ($("#txtMobileNo1").val().trim().length < 10) {
        alert("Please Enter 10 Digits of Mobile Number");
        $("#txtMobileNo1").focus();
        return false;
    }
    
    $.ajax({
      beforeSend: function () {
        $(".btn .spinner-border").show();
        $("#btn_update").attr("disabled", true);
      },
      url: "/update_post_wholesaler",
      type: "POST",
      data: { 
              txtShopName: $("#txtShopName1").val(),
              txtName: $("#txtName1").val(),
              txtEmail: $("#txtEmail1").val(),
              txtMobileNo: $("#txtMobileNo1").val(),
              id: $("#edit_id").val()
        },

      success: function (result) {
        // snackbar_success("Wholesaler Details Updated Succesfully");
        alert("Wholesaler Details Updated Succesfully");
        location.reload();
      },
      error: function (request, error) {
        console.error(error);
      },
      complete: function () {
        $(".btn .spinner-border").hide();
        $("#btn_update").attr("disabled", false);
      },
    });
  });

  //Delete work step
  $(document).on("click", "#btn_delete", function () {

    $.ajax({
      beforeSend: function () {
        $(".btn .spinner-border").show();
      },

      url: "/delete_post_wholesaler",
      type: "POST",
      data: {id: $("#delete_id").val(),},
      success: function () {
        // snackbar_success("Wholesaler Details deleted succesfully");
        alert("Wholesaler Details deleted succesfully");
        location.reload();
      },
      error: function (request, error) {
        console.error(error);
      },
      complete: function () {
        $(".btn .spinner-border").hide();
        // Reset Form
        //$("#view_field_form")[0].reset();
        $(".close").click();
      },
    });
  });

  $(document).on("click", "#add_user", function () {

    $("#txtName").val('');
    $("#txtEmail").val('');
    $("#txtMobileNo").val('');
    $("#txtPassword").val('');
    $("#selRole").val('');
    $("#txtName").focus('');

  });
});

function getAdminData() {

  $.ajax({

      url: "/get_data/wholesaler/",
      type: "POST",
      processData: false,
      contentType: false,
      success: function (response) {
        // console.log(response[0].first_name);

        // var lclJSON = JSON.parse(response);
        $("#tableData tr:gt(0)").remove();
        for(var i = 0; i < response.length; i++) {
          var j = i + 1;
          $("#tableData").append('<tr><td>'+j+'</td><td style="display: none;">'+response[i].wh_id+'</td><td>'+response[i].wh_shop_name+'</td><td>'+response[i].wh_name+'</td><td>'+response[i].wh_mobile+'</td><td>'+response[i].wh_email+'</td><td><div class="d-flex" style="justify-content: space-evenly;"><a href="javascript:void(0);" id="edit_row" title="View/Edit" data-toggle="modal" data-target="#edit_modal" class="pd-setting-ed" onClick="getRowsUpdate();"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>  <a href="javascript:void(0);" title="Delete" data-toggle="modal" data-target="#delete_modal" class="text-danger" id="delete_row" onClick="getRowsDelete();"><i class="fa fa-trash-o" aria-hidden="true"></i></a></div></td></tr>');
        }
      },
      error: function (request, error) {
        console.error(error);
      },
      complete: function () {

      },
    });

}

function getRowsUpdate() {
  $("#tableData tr").click(function() {
      var currentRow = $(this).closest("tr");
      var lclID = currentRow.find("td:eq(1)").text();
      var lclShopName = currentRow.find("td:eq(2)").text();
      var lclName = currentRow.find("td:eq(3)").text();
      var lclEmail = currentRow.find("td:eq(4)").text();
      var lclMobileNo = currentRow.find("td:eq(5)").text();
      var lclRole = currentRow.find("td:eq(6)").text();
      // alert(lclRole);
      $("#txtShopName1").val(lclShopName);
      $("#txtName1").val(lclName);
      $("#txtEmail1").val(lclEmail);
      $("#txtMobileNo1").val(lclMobileNo);
      $("#edit_id").val(lclID);

  });
}


function getRowsDelete() {
  $("#tableData tr").click(function() {
      var currentRow = $(this).closest("tr");
      var lclID = currentRow.find("td:eq(1)").text();
      // alert(lclID);
      $("#delete_id").val(lclID);

  });
}
