var lclFilePath = "";
function encodeImageFileAsURL(element) {
  var file = txtImage.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    // console.log('RESULT', reader.result);
    lclFilePath = reader.result;
  };
  reader.readAsDataURL(file);
}

function encodeImageFileAsURL1(element) {
  var file = txtImage1.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    // console.log('RESULT', reader.result);
    lclFilePath = reader.result;
  };
  reader.readAsDataURL(file);
}

$("#btn_add").click(function (e) {
  //verification

  if ($("#selCategory").val().trim().length < 1) {
    alert("Please Select Category");
    $("#selCategory").focus();
    return false;
  }

  if ($("#selSubCategory").val().trim().length < 1) {
    alert("Please Select sub category");
    $("#selSubCategory").focus();
    return false;
  }

  if ($("#txtImage").val().trim().length < 1) {
    snackbar_error("Please Select Image");
    $("#txtImage").focus();
    return false;
  }

  if ($("#txtName").val().trim().length < 1) {
    alert("Please Enter Name");
    $("#txtName").focus();
    return false;
  }

  if ($("#txtRate").val().trim().length < 1) {
    alert("Please Enter Rate");
    $("#txtRate").focus();
    return false;
  }

  if ($("#txtDesc").val().trim().length < 1) {
    alert("Please Enter Description");
    $("#txtDesc").focus();
    return false;
  }
  if ($("#txtDesc").val().trim().length < 1) {
    alert("Please Enter Description");
    $("#txtDesc").focus();
    return false;
  }
  if ($("#txtQTY").val().trim().length < 1) {
    alert("Please Enter Quantity");
    $("#txtQTY").focus();
    return false;
  }

  $.ajax({
    beforeSend: function () {
      $(".btn .spinner-border").show();
      $("#btn_add").attr("disabled", true);
    },
    url: "/insert_post_product",
    type: "POST",
    data: {
      selCategory: $("#selCategory").val(),
      selSubCategory: $("#selSubCategory").val(),
      txtImage: lclFilePath,
      txtName: $("#txtName").val(),
      txtPrice: $("#txtRate").val(),
      txtQTY: $("#txtQTY").val(),
      txtDescription: $("#txtDesc").val(),
    },
    success: function (result) {
      alert("Product Added Succesfully");
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
    if ($("#selCategory1").val().trim().length < 1) {
      alert("Please Select Category");
      $("#selCategory1").focus();
      return false;
    }

    if ($("#selSubCategory1").val().trim().length < 1) {
      alert("Please Select sub category");
      $("#selSubCategory1").focus();
      return false;
    }

    if ($("#txtImage1").val() != "") {
      $("#txtImageURL1").val("");
    }

    if ($("#txtName1").val().trim().length < 1) {
      alert("Please Enter Name");
      $("#txtName1").focus();
      return false;
    }

    if ($("#txtRate1").val().trim().length < 1) {
      alert("Please Enter Rate");
      $("#txtRate1").focus();
      return false;
    }

    if ($("#txtDesc1").val().trim().length < 1) {
      alert("Please Enter Description");
      $("#txtDesc1").focus();
      return false;
    }

    if ($("#txtQTY1").val().trim().length < 1) {
      alert("Please Enter Quantity");
      $("#txtQTY1").focus();
      return false;
    }
    $.ajax({
      beforeSend: function () {
        $(".btn .spinner-border").show();
        $("#btn_update").attr("disabled", true);
      },
      url: "/update_post_product",
      type: "POST",
      data: {
        selCategory: $("#selCategory1").val(),
        selSubCategory: $("#selSubCategory1").val(),
        txtImage: lclFilePath,
        txtName: $("#txtName1").val(),
        txtPrice: $("#txtRate1").val(),
        txtQTY: $("#txtQTY1").val(),
        txtDescription: $("#txtDesc1").val(),
        id: $("#edit_id").val(),
      },

      success: function (result) {
        // snackbar_success("Wholesaler Details Updated Succesfully");
        alert("Product Details Updated Succesfully");
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

      url: "/delete_post_product",
      type: "POST",
      data: {
        id: $("#delete_id").val(),
      },
      success: function () {
        // snackbar_success("Wholesaler Details deleted succesfully");
        alert("Product Details deleted succesfully");
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
    $("#txtName").val("");
    $("#txtEmail").val("");
    $("#txtMobileNo").val("");
    $("#txtPassword").val("");
    $("#selRole").val("");
    $("#txtName").focus("");
  });
});

function getAdminData() {
  $.ajax({
    url: "/get_data/product/",
    type: "POST",
    processData: false,
    contentType: false,
    success: function (response) {
      // console.log(response[0].first_name);

      // var lclJSON = JSON.parse(response);
      $("#tableData tr:gt(0)").remove();
      for (var i = 0; i < response.length; i++) {
        var j = i + 1;
        $("#tableData").append(
          "<tr><td>" +
            j +
            '</td><td style="display: none;">' +
            response[i].pd_id +
            "</td><td>" +
            response[i].pd_category +
            "</td><td>" +
            response[i].pd_sub_category +
            "</td> <td><img src=" +
            response[i].pd_image +
            ">" +
            "</td><td>" +
            response[i].pd_name +
            "</td><td>" +
            response[i].pd_price +
            "</td><td>" +
            response[i].pd_description +
            "</td><td>" +
            response[i].pd_qty +
            '</td><td><div class="d-flex" style="justify-content: space-evenly;"><a href="javascript:void(0);" id="edit_row" title="View/Edit" data-toggle="modal" data-target="#edit_modal" class="pd-setting-ed" onClick="getRowsUpdate();"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>  <a href="javascript:void(0);" title="Delete" data-toggle="modal" data-target="#delete_modal" class="text-danger" id="delete_row" onClick="getRowsDelete();"><i class="fa fa-trash-o" aria-hidden="true"></i></a></div></td></tr>'
        );
      }
    },
    error: function (request, error) {
      console.error(error);
    },
    complete: function () {},
  });
}

function getCategory() {
  $.ajax({
    url: "/get_data/category/",
    type: "POST",
    processData: false,
    contentType: false,
    success: function (response) {
      for (var i = 0; i < response.length; i++) {
        $("#selCategory").append(
          "<option value='" +
            response[i].ca_name +
            "'>" +
            response[i].ca_name +
            "</option>"
        );
        $("#selCategory1").append(
          "<option value='" +
            response[i].ca_name +
            "'>" +
            response[i].ca_name +
            "</option>"
        );
      }
    },
    error: function (request, error) {
      console.error(error);
    },
    complete: function () {},
  });
}
getCategory();

$("#selCategory").change(function () {
  $.ajax({
    url: "/get_sub_category/",
    type: "POST",
    data: {
      selCategory: $("#selCategory").val(),
    },
    success: function (response) {
      $("#selSubCategory").empty();
      $("#selSubCategory").append(
        "<option value=''>Please Select Sub Category</option>"
      );
      for (var i = 0; i < response.length; i++) {
        $("#selSubCategory").append(
          "<option value='" +
            response[i].sc_name +
            "'>" +
            response[i].sc_name +
            "</option>"
        );
      }
    },
    error: function (request, error) {
      console.error(error);
    },
    complete: function () {},
  });
});

$("#selCategory1").change(function () {
  // alert($("#selCategory1").val());

  $.ajax({
    url: "/get_sub_category1/",
    type: "POST",
    data: {
      selCategory1: $("#selCategory1").val(),
    },
    success: function (response) {
      $("#selSubCategory1").empty();
      $("#selSubCategory1").append(
        "<option value=''>Please Select Sub Category</option>"
      );
      for (var i = 0; i < response.length; i++) {
        $("#selSubCategory1").append(
          "<option value='" +
            response[i].sc_name +
            "'>" +
            response[i].sc_name +
            "</option>"
        );
      }
    },
    error: function (request, error) {
      console.error(error);
    },
    complete: function () {},
  });
});

function getRowsUpdate() {
  $("#tableData tr").click(function () {
    var currentRow = $(this).closest("tr");
    var lclID = currentRow.find("td:eq(1)").text();
    var lclCategory = currentRow.find("td:eq(2)").text();
    var lclSubCategory = currentRow.find("td:eq(3)").text();
    var lclImage = currentRow.find("td:eq(4)").text();
    var lclName = currentRow.find("td:eq(5)").text();
    var lclPrice = currentRow.find("td:eq(6)").text();
    var lclDesc = currentRow.find("td:eq(7)").text();
    var lclQTY = currentRow.find("td:eq(8)").text();

    $("#selCategory1").val(lclCategory);
    $("#selSubCategory1").val(lclSubCategory);
    $("#txtName1").val(lclName);
    $("#txtImageURL1").val(lclImage);
    $("#txtRate1").val(lclPrice);
    $("#txtQTY1").val(lclQTY);
    $("#txtDesc1").val(lclDesc);
    $("#edit_id").val(lclID);
  });
}

function getRowsDelete() {
  $("#tableData tr").click(function () {
    var currentRow = $(this).closest("tr");
    var lclID = currentRow.find("td:eq(1)").text();
    // alert(lclID);
    $("#delete_id").val(lclID);
  });
}
