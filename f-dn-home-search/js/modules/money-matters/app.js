(function() {
    var course_field_required = false,
        form_complete = false,
        complete_lock = false,
        DATA_SRC = "data.php";

    /**
     *
     *  jQuery function ready
     *
     * ------------------ */

    jQuery(function ($) {

        var $popup = $(".popup");

        $(".popup_control").hover(function() {
            $popup.fadeIn("fast");
        });

        $popup.mouseout(function() {
            $popup.fadeOut("slow");
        });

        // hide blocks we don"t show at the start
        $(".qblock").hide();
        $(".form-row[data-row != \"1\"]").hide();
        $(".next-block").hide();
        $(".degree-block").hide();
        $(".info-block").hide();
        $(".uk-eu-block").hide();
        $(".yr2014-block").hide();
        $(".no-result-block").hide();

        // Course question depends on which
        // School so hide both until we
        // know which one to show
        $(".cass-course").hide();
        $(".shs-course").hide();

        // show the first block to get started
        $(".qblock.one").slideDown();
    /*
    $("#calculator").submit(function(e) {
        e.preventDefault();
        calculate_bursary();
    });
    */

        /** ******************************************
          * FORM LOGIC
          *
          * check for changes in the form and
          * update accordingly
          *
          */
        $("#calculator").change(function (c) {

            var fm_id = c.target.id;

            $(".next-block").slideUp("fast");
            $(".degree-block").slideUp("fast");
            $(".info-block").slideUp("fast");
            $(".uk-eu-block").slideUp("fast");
            $(".yr2014-block").slideUp("fast");
            $(".no-result-block").slideUp("fast");


        //  if(form_complete)
        //      return;

            // If user chooses non-uk / non-eu, we"re done here
            if (fm_id === "fm-live-04") {
                non_uk_eu();
            }

            // If user chooses 2014, we"re done here
            if (fm_id === "fm-yoe-2014") {
                yr2014();
            }

            // show block 1, row 2
            if ($("input[name=\"year_of_entry\"]:checked").val() && $("input[name=\"ordinarily_resident_in\"]:checked").val()) {
                $(".qblock.one .form-row[data-row=\"2\"]").slideDown();
            }

            // show block 1, row 3
            if ($("input[name=\"age\"]:checked").val() && $("input[name=\"care_leaver\"]:checked").val()) {
                $(".qblock.one .form-row[data-row=\"3\"]").slideDown();
            }

            // show block 2
            if ($("input[name=\"in_city_halls\"]:checked").val() && $("input[name=\"first_degree\"]:checked").val()) {
                $(".qblock.two").slideDown();
            }

            // if Resident in EU, we don"t show the Household-income question
           /* if ($("input[name=\"ordinarily_resident_in\"]:checked").val() == "EU") {
                $(".household-income").fadeOut("fast");
            } else {
                $(".household-income").fadeIn("fast");
            }*/

            // show block 3
            if ($("input[name=\"household_income\"]:checked").val() && $("input[name=\"sfe_funding\"]:checked").val()) {
                $(".qblock.three").slideDown();
            }

            // show block 4
            if ($("input[name=\"academic_achievement\"]:checked").val()) {
                $(".qblock.four").slideDown();
            }

            // School choice, show relevant course list
            // or complete form if we don"t need to
            // show the course list
            if ($("input[name=\"school\"]:checked").val()) {

                if ($("input[name=\"school\"]:checked").val() === "Cass") {

                    $(".shs-course").fadeOut("fast", function() {
                        $("input[name=\"health_course\"]").prop("checked", false);
                        $(".cass-course").fadeIn();
                        course_field_required = true;
                    });

                } else if ($("input[name=\"school\"]:checked").val() === "SHS") {

                    $(".cass-course").fadeOut("fast", function() {
                        $("input[name=\"cass_course\"]").prop("checked", false);
                        $(".shs-course").fadeIn();
                        course_field_required = true;
                    });

                } else {

                    $(".cass-course").fadeOut("fast");
                    $(".shs-course").fadeOut("fast");
                    $("input[name=\"health_course\"]").prop("checked", false);
                    $("input[name=\"cass_course\"]").prop("checked", false);
                    course_field_required = false;
                    form_complete();
                }

            }

            if ($("input[name=\"cass_course\"]:checked").val() || $("input[name=\"health_course\"]:checked").val()) {

                if (course_field_required === true || complete_lock === false) {
                    if ($("input[name=\"cass_course\"]:checked").val() || $("input[name=\"health_course\"]:checked").val()) {
                        form_complete();
                    }
                }

            }

            function form_complete() {
                final_degree_check_and_calculate();
            }

            function final_degree_check_and_calculate() {

                // if "no" to 1st degree question, show
                // degree-block. Possibly show additional
                // information
                if ($("input[name=\"first_degree\"]:checked").val() === "no") {

                    if ($("input[name=\"school\"]:checked").val() !== "Cass") {
                        if (["Midwifery", "Nursing", "Radiography", "Speech &amp; Language Therapy"].indexOf($("input[name=\"health_course\"]:checked").val()) > 0) {
                            $(".degree-block .additional").css("display","block");
                        }
                    }
                    $(".degree-block").slideDown();
                    $(".info-block").slideDown();
                    form_complete = true;

                } else {
                    // Look for a match and display results
                    calculate_bursary();
                }

            }

        }); // end change

        /**
          * We can"t support the student with this
          * calculator, they are non UK / EU
          *
          */
        function non_uk_eu() {

            $(".qblock.one").slideUp();
            $(".uk-eu-block").slideDown();
            $(".info-block").slideDown();
            form_complete = true;

        }

        /**
          * We can"t support the student with this
          * calculator, they are non UK / EU
          *
          */
        function yr2014() {

            $(".qblock.one").slideUp();
            $(".yr2014-block").slideDown();
            $(".info-block").slideDown();
            form_complete = true;

        }

        /**
          * Send away to the database to see if we have a result
          * If no result, show "sorry" box
          * If a result, show amount and other info
          */
        function calculate_bursary() {

            $(".next-block .option .amount").empty();

            var data = $("#calculator").serialize();

            try {
                $.ajax({
                    url: "/expense-calculator/",
                    data: data,
                    type: "post",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {

                    },
                    success: function (data) {

                        if (data === "no") {
                            // show no-results block
                            $(".no-result-block").slideDown();
                        } else {
                            // show block with bursary information
                            $(".next-block .option .amount").html(data);
                            $(".next-block").slideDown();
                            form_complete = true;
                        }
                    }
                });

            } catch (error) {

            }
        }
    }); //end DOM ready
}());