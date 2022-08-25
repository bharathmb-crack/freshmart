

$("#btn_add").click(function (e) {
  //verification
  if ($("#txtName").val().trim().length < 1) {
    snackbar_error("Please Enter Name");
    $("#txtName").focus();
    return false;
  }



  if ($("#txtMobileNo").val().trim().length < 10) {
    snackbar_error("Please Enter 10 Digits of Mobile Number");
    $("#txtMobileNo").focus();
    return false;
  }

  if ($("#txtPassword").val().trim().length < 1) {
    snackbar_error("Please Enter Password");
    $("#txtPassword").focus();
    return false;
  }

  if ($("#selRole").val().trim().length < 1) {
    snackbar_error("Please Select Role");
    $("#selRole").focus();
    return false;
  }


  $.ajax({
    beforeSend: function () {
      $(".btn .spinner-border").show();
      $("#btn_add").attr("disabled", true);
    },
    url: "/insert_post_admin",
    type: "POST",
    data: {
          txtName: $("#txtName").val(),
          txtEmail: $("#txtEmail").val(),
          txtMobileNo: $("#txtMobileNo").val(),
          txtPassword: $("#txtPassword").val(),
          selRole: $("#selRole").val()
    },
    success: function (result) {
      alert("Admin/User Added Succesfully");
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


    if ($("#txtMobileNo1").val().trim().length < 10) {
        snackbar_error("Please Enter 10 Digits of Mobile Number");
        $("#txtMobileNo1").focus();
        return false;
    }

    if ($("#selRole1").val().trim().length < 1) {
        snackbar_error("Please Select Role");
        $("#selRole1").focus();
        return false;
    }
    
    $.ajax({
      beforeSend: function () {
        $(".btn .spinner-border").show();
        $("#btn_update").attr("disabled", true);
      },
      url: "/update_post_admin",
      type: "POST",
      data: { txtName: $("#txtName1").val(),
              txtEmail: $("#txtEmail1").val(),
              txtMobileNo: $("#txtMobileNo1").val(),
              selRole: $("#selRole1").val(),
              id: $("#edit_id").val()
        },

      success: function (result) {
        // snackbar_success("Admin/User Details Updated Succesfully");
        alert("Admin/User Details Updated Succesfully");
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

      url: "/delete_post_admin",
      type: "POST",
      data: {id: $("#delete_id").val(),},
      success: function () {
        // snackbar_success("Admin/User Details deleted succesfully");
        alert("Admin/User Details deleted succesfully");
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

      url: "/get_data/contact_details/",
      type: "POST",
      processData: false,
      contentType: false,
      success: function (response) {
        // console.log(response[0].first_name);

        // var lclJSON = JSON.parse(response);
        $("#tableData tr:gt(0)").remove();
        for(var i = 0; i < response.length; i++) {
          var j = i + 1;
          $("#tableData").append('<tr><td>'+j+'</td><td style="display: none;">'+response[i].cn_id+'</td><td>'+response[i].cn_name+'</td><td>'+response[i].cn_email+'</td><td>'+response[i].cn_subject+'</td><td>'+response[i].cn_message+'</td><td>'+response[i].cn_phone+'</td></tr>');
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
      var lclEmail = currentRow.find("td:eq(3)").text();
      var lclMobileNo = currentRow.find("td:eq(4)").text();
      var lclRole = currentRow.find("td:eq(5)").text();
      // alert(lclRole);
      $("#txtName1").val(lclName);
      $("#txtEmail1").val(lclEmail);
      $("#txtMobileNo1").val(lclMobileNo);
      $("#selRole1").val(lclRole);
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
