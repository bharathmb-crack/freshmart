

$("#btn_add").click(function (e) {
  //verification
  if ($("#txtName").val().trim().length < 1) {
    snackbar_error("Please Enter Name");
    $("#txtName").focus();
    return false;
  }


  $.ajax({
    beforeSend: function () {
      $(".btn .spinner-border").show();
      $("#btn_add").attr("disabled", true);
    },
    url: "/insert_post_category",
    type: "POST",
    data: {
          txtName: $("#txtName").val()
    },
    success: function (result) {
      alert("Category Added Succesfully");
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

    if ($("#txtName1").val().trim().length < 1) {
        snackbar_error("Please Enter Name");
        $("#txtName1").focus();
        return false;
    }

    $.ajax({
      beforeSend: function () {
        $(".btn .spinner-border").show();
        $("#btn_update").attr("disabled", true);
      },
      url: "/update_post_category",
      type: "POST",
      data: { txtName: $("#txtName1").val(),
              id: $("#edit_id").val()
        },

      success: function (result) {
        // snackbar_success("Admin/User Details Updated Succesfully");
        alert("Category Details Updated Succesfully");
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

      url: "/delete_post_category",
      type: "POST",
      data: {id: $("#delete_id").val(),},
      success: function () {
        // snackbar_success("Admin/User Details deleted succesfully");
        alert("Category Details deleted succesfully");
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

      url: "/get_data/category/",
      type: "POST",
      processData: false,
      contentType: false,
      success: function (response) {
        // console.log(response[0].first_name);

        // var lclJSON = JSON.parse(response);
        $("#tableData tr:gt(0)").remove();
        for(var i = 0; i < response.length; i++) {
          var j = i + 1;
          $("#tableData").append('<tr><td>'+j+'</td><td style="display: none;">'+response[i].ca_id+'</td><td>'+response[i].ca_name+'</td><td><div class="d-flex" style="justify-content: space-evenly;"><a href="javascript:void(0);" id="edit_row" title="View/Edit" data-toggle="modal" data-target="#edit_modal" class="pd-setting-ed" onClick="getRowsUpdate();"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>  <a href="javascript:void(0);" title="Delete" data-toggle="modal" data-target="#delete_modal" class="text-danger" id="delete_row" onClick="getRowsDelete();"><i class="fa fa-trash-o" aria-hidden="true"></i></a></div></td></tr>');
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
      var lclName = currentRow.find("td:eq(2)").text();
      // alert(lclRole);
      $("#txtName1").val(lclName);
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
