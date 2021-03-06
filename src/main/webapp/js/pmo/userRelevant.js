$(document).ready(function() {
	loadDu();
	loadBu();
	$('#addUserForm').bootstrapValidator({
		message: 'This value is not valid',

        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	eHr: {
				validators: {
                    notEmpty: {
                        message: 'Please enter your E-HR'
                    },
                    regexp: {
                        regexp: /^E\d{9}$/,
                        message: 'Please enter the E-HR（E and 9 digits）'
                    },
                    remote:{
                    	type:"post",
                    	url: path+'/service/user/checkEhr',
                        message:"E-HR already exists"
                    }

                 }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your Name'
                    }
                }
            },
            bu: {
                validators: {
                    notEmpty: {
                        message: 'Please select your BU'
                    }
                }
            },
            du: {
                validators: {
                    notEmpty: {
                        message: 'Please select your DU'
                    }

                }
            },
            type: {
                validators: {
                    notEmpty: {
                        message: 'Please select your Type'
                    }

                }
            },
            email: {
                validators: {
                	 regexp: {
                         regexp:/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
                         message: 'Please enter correct Email'
                     },
                     stringLength: {
                         max: 100,
                         message: 'Exceeded the maxLength'
                     }
                }
            }
        }
    });
	
	
     
});




function addUser(){
	var bootstrapValidator = $("#addUserForm").data('bootstrapValidator');
	bootstrapValidator.validate();
	if(bootstrapValidator.isValid()){
		var eHr = $("#eHr").val();
		var name = $("#name").val();
		var bu = $("#bu").val();
		var du = $("#du").val();
		var type = $("#type").val();
		var temp_bu="";
		var temp_du="";
		var email= $("#email").val();
		for(var i=0;i<bu.length;i++){
			temp_bu+=bu[i]+",";
		}
		for(var j=0;j<du.length;j++){
			temp_du+=du[j]+",";
		}
		$.ajax({
			url:path+'/service/user/addUser',
			dataType:"json",
			data:{"eHr":eHr,"name":name,"bu":temp_bu,"du":temp_du,"type":type, "email":email},
			async:true,
			cache:false,
			type:"post",
			success:function(resultFlag){
				if(resultFlag){
					$("html,body").animate({scrollTop:0}, 500);
					$('#successAlert').html('user:'+eHr+' information added succesffully').show();
					setTimeout(function () {
						$('#successAlert').hide();
					}, 2000);
				}
			}
		})
		
	}else{
		return;
	}
	
}


function loadDu(){
	$.ajax({
		url:path+'/service/csDept/queryAllCSSubDept',
		dataType:"json",
		async:true,
		cache:false,
		type:"post",
		success:function(result){
			var userType = result.user.userType;
			
			var csSubs = result.csSubDepts;
			if(userType=='0'){
				for(var i = 0;i<result.data.length;i++){
					$("#du").append("<option value='"+result.data[i].csSubDeptId+"'>"+result.data[i].csSubDeptName+"</option>");
				}
			}else{
				if(csSubs.length==1){
					$("#du").append("<option value='"+csSubs[0].csSubDeptId+"'>"+csSubs[0].csSubDeptName+"</option>");
					$('#du').val(csSubs[0].csSubDeptId);
					$("#du").attr("disabled","disabled");
				}else if(csSubs.length>1){
					$("#du").empty();
					for(var i = 0;i<csSubs.length;i++){
						$("#du").append("<option value='"+csSubs[i].csSubDeptId+"'>"+csSubs[i].csSubDeptName+"</option>");
					}
				}
			}
			$('.selectpicker').selectpicker({
		        'selectedText': 'cat'
		    });
			$('.selectpicker').selectpicker('refresh');
		}
	})
}

var csBuMap = new Map();
function loadBu(){
	var url = path+'/json/csBuNewName.json'
	$.getJSON(url,  function(data) {
	       $.each(data, function(i, item) {
	    	   $("#bu").append("<option>"+item.name+"</option>");
	    	   csBuMap.set(item.name,item.key);
	       })
	       $('.selectpicker').selectpicker({
		        'selectedText': 'cat'
		   });
		   $('.selectpicker').selectpicker('refresh');
	});
}

