function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.single_trial = slide({
    name: "single_trial",
    
    start: function() {
      $(".err").hide();
      $(".err2").hide();
      this.startTime = Date.now();
      $("#manipulation").html("While Vicki is outside playing, her sister,<br> Denise, moves the violin to <b>" + exp.condition + " container</b>.");
    },
    
    button : function() {
      response_red = $("#text_response_red").val();
      response_green = $("#text_response_green").val();
      response_purple = $("#text_response_purple").val();
      response_blue = $("#text_response_blue").val();

      if ($("#text_response_red").val().length == 0 || $("#text_response_green").val().length == 0 || 
      $("#text_response_purple").val().length == 0 || $("#text_response_blue").val().length == 0) {
        $(".err").show();
      } else {
      if (!(($("#text_response_red").val()!='' && $("#text_response_red").val()>=0 && $("#text_response_red").val()<=100) &&
      ($("#text_response_green").val()!='' && $("#text_response_green").val()>=0 && $("#text_response_green").val()<=100) &&
      ($("#text_response_purple").val()!='' && $("#text_response_purple").val()>=0 && $("#text_response_purple").val()<=100) &&
      ($("#text_response_blue").val()!='' && $("#text_response_blue").val()>=0 && $("#text_response_blue").val()<=100))) {
        $(".err2").show();
        $(".err").hide();
      } else {
      	 this.endTime = Date.now()
      	 this.rt = (this.endTime - this.startTime)/1000;
        exp.data_trials.push({
          "trial_type" : "subject_responses",
          "response_red" : response_red,
          "response_green" : response_green,
          "response_purple" : response_purple,
          "response_blue" : response_blue,
          "rt_in_seconds": this.rt
        });
        exp.go(); //make sure this is at the *end*, after you log your data
      }}
    },
  });

slides.color_check = slide({
	name: "color_check",
	start: function () {
		$(".err3").hide();
	},
	button : function() {
	
	response_color_red = $("#text_response_color_red").val();
	response_color_green = $("#text_response_color_green").val();
	response_color_purple = $("#text_response_color_purple").val();
	response_color_blue = $("#text_response_color_blue").val();
	debugger;

	if (($("#text_response_color_red").val().length == 0 || isNaN($("#text_response_color_red").val()) == false) || 
	($("#text_response_color_green").val().length == 0 || isNaN($("#text_response_color_green").val()) == false) || 
      ($("#text_response_color_purple").val().length == 0 || isNaN($("#text_response_color_purple").val()) == false) || 
      ($("#text_response_color_blue").val().length == 0 || isNaN($("#text_response_color_blue").val()) == false)) {
        $(".err3").show();
        } else {
        exp.data_trials.push({
          "trial_type" : "color_check",
          "response_color_red" : response_color_red,
          "response_color_green" : response_color_green,
          "response_color_purple" : response_color_purple,
          "response_color_blue" : response_color_blue  
        });
        exp.go(); //make sure this is at the *end*, after you log your data
      }
    },
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        //colorblind : $('input[name="colorblind"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000,
          "fingerprintData" : fingerprint
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = _.sample(["the red", "the purple", "another"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "instructions", "single_trial", 'subj_info', 'thanks'];
  
  
  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}