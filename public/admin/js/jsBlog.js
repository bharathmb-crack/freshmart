var lclFilePath = "";
  function encodeImageFileAsURL(element) {
    var file = txtImage.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      // console.log('RESULT', reader.result);
      lclFilePath = reader.result;
    }
    reader.readAsDataURL(file);
  }


function encodeImageFileAsURL1(element) {
    var file = txtImage1.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      // console.log('RESULT', reader.result);
      lclFilePath = reader.result;
    }
    reader.readAsDataURL(file);
  }

$("#btn_add").click(function (e) {
  //verification

   if ($("#txtImage").val().trim().length < 1) {
    alert("Please Upload Image");
    $("#txtImage").focus();
    return false;
  }

  if ($("#txtTitle").val().trim().length < 1) {
    alert("Please Enter Title");
    $("#txtTitle").focus();
    return false;
  }

  if ($("#txtContent").val().trim().length < 1) {
    alert("Please Enter Content");
    $("#txtContent").focus();
    return false;
  }

  if ($("#txtDate").val().trim().length < 1) {
    alert("Please Enter Date");
    $("#txtDate").focus();
    return false;
  }



  $.ajax({
    beforeSend: function () {
      $(".btn .spinner-border").show();
      $("#btn_add").attr("disabled", true);
    },
    url: "/insert_post_blog",
    type: "POST",
    data: {
          txtImage: lclFilePath,
          txtTitle: $("#txtTitle").val(),
          txtContent: $("#txtContent").val(),
          txtDate: $("#txtDate").val()
    },
    success: function (result) {
      alert("Blog Added Succesfully");
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
      url: "/update_post_vendor",
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
        alert("Vendor Details Updated Succesfully");
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

      url: "/delete_post_blog",
      type: "POST",
      data: {id: $("#delete_id").val(),},
      success: function () {
        // snackbar_success("Wholesaler Details deleted succesfully");
        alert("Blog Details deleted succesfully");
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

      url: "/get_data/blog/",
      type: "POST",
      processData: false,
      contentType: false,
      success: function (response) {
        // console.log(response[0].first_name);

        // var lclJSON = JSON.parse(response);
        $("#tableData tr:gt(0)").remove();
        for(var i = 0; i < response.length; i++) {
          var j = i + 1;
          $("#tableData").append('<tr><td>'+j+'</td><td style="display: none;">'+response[i].bl_id+'</td><td>'+response[i].bl_image+'</td><td>'+response[i].bl_title+'</td><td>'+response[i].bl_content+'</td><td>'+response[i].bl_date+'</td><td><div class="d-flex" style="justify-content: space-evenly;"><a href="javascript:void(0);" id="edit_row" title="View/Edit" data-toggle="modal" data-target="#edit_modal" class="pd-setting-ed" onClick="getRowsUpdate();"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>  <a href="javascript:void(0);" title="Delete" data-toggle="modal" data-target="#delete_modal" class="text-danger" id="delete_row" onClick="getRowsDelete();"><i class="fa fa-trash-o" aria-hidden="true"></i></a></div></td></tr>');
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
      var lclImage = currentRow.find("td:eq(2)").text();
      var lclTitle = currentRow.find("td:eq(3)").text();
      var lclContent = currentRow.find("td:eq(4)").text();
      var lclDate = currentRow.find("td:eq(5)").text();
      // alert(lclRole);
      $("#txtImageURL1").val(lclImage);
      $("#txtTitle1").val(lclTitle);
      $("#txtContent1").val(lclContent);
      $("#txtDate1").val(lclDate);
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
