var viewController = {        
    access: false,
    onPOEvent: false,
    onPOLineEvent: false,    
    init: function(){
        $('.logout').on('click',function(){
            $(':mobile-pagecontainer').pagecontainer('change', '#loginPage', {
                transition: 'fade',
                changeHash: false,
                reverse: true,
                showLoadMsg: true
            });            
            $("#user").val("");
            $("#password").val("");
        });
        $(document).on('click', '.logBooks > li', viewController.createLogBookDetails); 
        $('#updateLogButton').on('click',function(){ 
            $.mobile.loading( "show" ); 
            var macStatus;
            var width;
            if($('#logMacStatus').val() == 1) macStatus = 'Running';
            else if($('#logMacStatus').val() == 2) macStatus = 'Loading';
            else if($('#logMacStatus').val() == 3) macStatus = 'Joining';
            else if($('#logMacStatus').val() == 4) macStatus = 'Mixing';
            else if($('#logMacStatus').val() == 5) macStatus = 'Width change';
            if($('#logWidth').val() == 1) width = '3.66';
            else if($('#logWidth').val() == 2) width = '4.00';
            if($('#logReading').val() == '' || $('#logHrProd').val() == '' || $('#logRemarks').val() == ''){
                $('<div>').simpledialog2({
                mode: 'blank',
                headerText: 'Warning',
                headerClose: true,
                transition: 'flip',
                themeDialog: 'b',
                zindex: 2000,
                blankContent : 
                  "<div style='padding: 15px;'><p>Please enter values.</p>"+
                  "<a rel='close' data-role='button' href='#'>OK</a></div>"
              });
                $.mobile.loading( "hide" );  
            }
            else{
                var urlParm = viewController.logBook.RecId+'/'+macStatus+'/'+$('#logReading').val()+'/'+width+'/'+$('#logHrProd').val()+'/'+viewController.user+'/'+$('#logRemarks').val();                $.getJSON("http://192.168.1.31:99/AXMobileService.svc/updateLogBook/"+urlParm,function(data){ 
                    $( "#logBookDetails" ).popup( "close" );
                    viewController.createLogBook();
                })
                .always(function() {
                    $.mobile.loading( "hide" );  
                });                
            }            
        });
        $('#postPO').on('click',function(){
            if($('#weightPO').val() == '' || $('#heightPO').val() == '' || $('#stitchRatePO').val() == '' || $('#gsmPO').val() == ''){
                $('<div>').simpledialog2({
                mode: 'blank',
                headerText: 'Warning',
                headerClose: true,
                transition: 'flip',
                themeDialog: 'b',
                zindex: 2000,
                blankContent : 
                  "<div style='padding: 15px;'><p>Please enter values.</p>"+
                  "<a rel='close' data-role='button' href='#'>OK</a></div>"
              });
            }
            else{
                alert(viewController.PONumber);
                $.mobile.loading( "show" ); 
                var urlParm = viewController.PONumber+'/'+$('#weightPO').val()+'/'+$('#heightPO').val()+'/'+$('#stitchRatePO').val()+'/'+$('#gsmPO').val()+'/'+$('#remarksPO').val();
                $.getJSON("http://192.168.1.31:99/AXMobileService.svc/updatePileWtHt/"+urlParm,function(data)             { 
                    $( "#poDetails" ).popup( "close" );                $.getJSON("http://192.168.1.31:99/AXMobileService.svc/getTuftingPlanningOrder/"+viewController.machineId          ,function(data){
                        alert('gh');
                        viewController.POHeaders = data;
                        $(Mustache.render(viewController.poPageContentTmpl, viewController.POHeaders))    
                        .prependTo($('#planningOrderPage').find(':jqmData(role=content)'))            
                        .listview();
                        viewController.poLinePageContentTmpl = $('#poLinePageContentTmpl').html();
                    });
                })
                .always(function() {
                    $.mobile.loading( "hide" );  
                });
            }
        });
        $("#postLine").on('click',function(){ 
            $.mobile.loading( "show" );
            var urlParm = viewController.PONumber+"/"+viewController.POLine.SerialNo+'/'+viewController.user+'/'+$('#lnmLine').val()+'/'+$('#remarksLine').val(); 
            $.getJSON("http://192.168.1.31:99/AXMobileService.svc/updatePOLine/"+urlParm,function(data){                 /*$('#planningOrderLinePage').find(':jqmData(role=content)').html("");*/ 
                $.getJSON("http://192.168.1.31:99/AXMobileService.svc/getTuftingPlanningOrderLine/"+viewController.PONumber          ,function(data){ 
                    viewController.POLines = data;            
                    $(Mustache.render(viewController.poLinePageContentTmpl, viewController.POLine))    
                    .prependTo($('#planningOrderLinePage').find(':jqmData(role=content)'))            
                    .listview();                          
                    //$(document).on('click', '.orderLines > li', viewController.createPOLineDetails); 
                })
                .fail(function() {
                               alert('fail');
                })
                .always(function() {
                    $.mobile.loading( "hide" );             
                });                  
                $( "#poLineDetails" ).popup( "close" );
            })
            .always(function() {
                $.mobile.loading( "hide" );  
            });
            
            $.mobile.loading( "hide" );
            $( "#poLineDetails" ).popup( "close" );
        }); 
        $(document).on('pageinit', '.gridPage', viewController.createGridPage); 
        $(document).on('click', '.machines > li', viewController.createPOPage);  
        $( document ).on( "swipeleft swiperight", "#gridPage", function( e ) {        
            if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
                if ( e.type === "swiperight" ) {
                    $( "#left-panel" ).panel( "open" );
                }
            }
        });
        $(document).on('click', '.orders > li', viewController.createPOLinePage); 
        $( document ).on( "swipeleft swiperight", "#planningOrderPage", function( e ) {        
            if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
                if ( e.type === "swiperight" ) {
                    $( "#left-panelPO" ).panel( "open" );
                }
            }
        });
        $(document).on('click', '.orderLines > li', viewController.createPOLineDetails);  
        $( document ).on( "swipeleft swiperight", "#planningOrderLinePage", function( e ) {        
            if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
                if ( e.type === "swiperight" ) {
                    $( "#left-panelPOLine" ).panel( "open" );
                }
            }
        });
        $('.logBook').on('click',function(){   
            viewController.createLogBook();
            window.location.href = "#logBookPage";
            
        });
        viewController.login();
        
    },
    login: function(){        
        $("#login").on("click",function(){ 
        $.mobile.loading( "show" );  
        viewController.user = $("#user").val();    
        if($("#user").val() == "" || $("#password").val() == ""){
            $('#popupLogin').popup();
            $('#popupLogin').popup('open');
        }   
            else {                    $.getJSON("http://192.168.1.31:99/AXMobileService.svc/checkUser/"+viewController.user+"/"+$("#password").val()          ,function(data){                
                    if(data.toString() == "true") {
                        access = true;
                        viewController.tuftingMachine();                        
                    }
                    else {
                        $('#popupLogin').popup();
                        $('#popupLogin').popup('open');
                    }
                })
                .fail(function() {
                    $('#popupNetworkError').popup();
                    $('#popupNetworkError').popup('open');                
                })
                .always(function() {
                    $.mobile.loading( "hide" );  
                });
             }
        });
    },
    tuftingMachine: function(){        $.getJSON("http://192.168.1.31:99/AXMobileService.svc/getTuftingMachineByUser/"+viewController.user          ,function(data){ 
            viewController.machineData = data;
            viewController.gridPageTmpl = $('#gridPageTmpl').html();
            viewController.gridPageContentTmpl = $('#gridPageContentTmpl').html();
            viewController.poPageContentTmpl = $('#poPageContentTmpl').html();  
            $(':mobile-pagecontainer').pagecontainer('change', '#gridPage', {
                transition: 'slidefade',
                changeHash: false,
                reverse: true,
                showLoadMsg: true
            });        
        });
    },
    createGridPage: function(){
        var $page = $(this);             
        $(Mustache.render(viewController.gridPageContentTmpl, viewController.machineData))    
        .prependTo($page.find(':jqmData(role=content)'))            
        .listview();
        $page.find(':jqmData(role=footer)').show();
    },
    createPOPage: function(){
        var $page = $(this);
        $.mobile.loading( "show" ); 
        $('#planningOrderPage').find(':jqmData(role=content)').html("");                      
        viewController.machineId = viewController.machineData[$(this).index()].MachineNo;  $.getJSON("http://192.168.1.31:99/AXMobileService.svc/getTuftingPlanningOrder/"+viewController.machineId          ,function(data){ 
            viewController.POHeaders = data;
            $(Mustache.render(viewController.poPageContentTmpl, viewController.POHeaders))    
            .prependTo($('#planningOrderPage').find(':jqmData(role=content)'))            
            .listview();
            viewController.poLinePageContentTmpl = $('#poLinePageContentTmpl').html();
        })
        .fail(function() {
            $('#popupNetworkError').popup();
            $('#popupNetworkError').popup('open');              
        })
        .always(function() {
            $.mobile.loading( "hide" );            
        });
    },    
    createPOLinePage: function(){
        viewController.POHeader = viewController.POHeaders[$(this).index()];         
        $.mobile.loading( "show" );      
        if(viewController.POHeader.Posted == "True"){            
            $('.nonPostedPO').hide();
            $('.postedPO').show();
            viewController.poDetailsPageContentTmpl = $('#poDetailsPageContentTmpl').html(); 
            var details = $(Mustache.render(viewController.poDetailsPageContentTmpl, viewController.POHeader));        
             $('#poDetails')            
                .find('.postedPO').html(details);
        }
        else{ 
            $('.postedPO').hide();
            $('.nonPostedPO').show();
            $('#weightPO').val("");
            $('#heightPO').val("");
            $('#stitchRatePO').val("");
            $('#gsmPO').val("");
            $('#remarksPO').val("");
        }
        viewController.PONumber = viewController.POHeader.OrderNo;
        viewController.poDetailsPageContentTmpl = $('#poDetailsPageContentTmpl').html(); 
        var details = $(Mustache.render(viewController.poDetailsPageContentTmpl, viewController.POHeader));        
        if(viewController.POHeader.Sequence == 1){                   $.getJSON("http://192.168.1.31:99/AXMobileService.svc/getTuftingPlanningOrderLine/"+viewController.PONumber          ,function(data){ 
            
                viewController.POLines = data;            
                $(Mustache.render(viewController.poLinePageContentTmpl, viewController.POLines))    
                .prependTo($('#planningOrderLinePage').find(':jqmData(role=content)'))            
                .listview();
            })
            .fail(function() {
                $('#popupNetworkError').popup();
                $('#popupNetworkError').popup('open');              
            })
            .always(function() {
                $.mobile.loading( "hide" );             
            }); 
        }
        $.mobile.loading( "hide" );   
    },
    createPOLineDetails: function(){
        viewController.POLine = viewController.POLines[$(this).index()];
        if(viewController.POLine.Posted == "true"){              
            $('.nonPostedLine').hide();
            $('.postedLine').show();
            viewController.poLineDetailsPostedTmpl = $('#poLineDetailsPostedTmpl').html(); 
            var details = $(Mustache.render(viewController.poLineDetailsPostedTmpl, viewController.POLine));        
             $('#poLineDetails')            
                .find('.postedLine').html(details);
        }
        else{ 
            $('.postedLine').hide();
            $('.nonPostedLine').show();
            $('#lnmLine').val("");
            $('#remarksLine').val("");                           
        }        
    },
    createLogBook: function(){
        $.mobile.loading( "show" ); 
        viewController.logBookPageContentTmpl = $('#logBookPageContentTmpl').html();  $.getJSON("http://192.168.1.31:99/AXMobileService.svc/getLogBook/"+viewController.machineId          ,function(data){ 
            viewController.logBooks = data;
            $(Mustache.render(viewController.logBookPageContentTmpl, viewController.logBooks))    
            .prependTo($('#logBookPage').find(':jqmData(role=content)'))            
            .listview();             
        })
        .always(function() {
            $.mobile.loading( "hide" );  
        });
    },
    createLogBookDetails: function(){        
        viewController.logBook = viewController.logBooks[$(this).index()];
        $('#logReading').val("");
        $('#logHrProd').val("");
        $('#logRemarks').val("");
    }
};
document.addEventListener("app.Ready", viewController.init, false);

