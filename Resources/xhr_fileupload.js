var win = Titanium.UI.currentWindow;

var ind=Titanium.UI.createProgressBar({
	width:200,
	height:50,
	min:0,
	max:1,
	value:0,
	style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
	top:10,
	message:'Uploading Image',
	font:{fontSize:12, fontWeight:'bold'},
	color:'#888'
});

win.add(ind);
ind.show();

Titanium.Media.openPhotoGallery({

	success:function(event)
	{
		Ti.API.info("success! event: " + JSON.stringify(event));
		var image = event.media;
	
		var xhr = Titanium.Network.createHTTPClient();

		xhr.onerror = function(e)
		{
			Ti.UI.createAlertDialog({title:'Error', message:e.error}).show();
			Ti.API.info('IN ERROR ' + e.error);
		};
		xhr.setTimeout(20000);
		xhr.onload = function(e)
		{
      ind.hide();

      var result = JSON.parse(this.responseText);
			Ti.UI.createAlertDialog({title:'Your Money', message:'result: ' + result.total_money}).show();
			Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);

      var subwindow = Ti.UI.createWindow({ 
        height: 100,
        width: 100,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 6
      });

      var PayPalButton = Titanium.UI.createButton({
          title: '',
          //backgroundImage:'btn_xpressCheckout.gif',
          backgroundImage:'btn_donate_LG.gif',
              //<input type="image" src="http://www.paypal.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="Make payments with PayPal - it's fast, free and secure!">
              //top:280,
              //right:20,
              //left:150,
              height:26,
              width:92
          });
          
      PayPalButton.addEventListener('click',function(e) {

      //open link in safari - application will close
      Titanium.Platform.openURL('http://localhost:3000/orders/create?amount=' + result.total_money);

      });

     win.add(PayPalButton);

		};

		xhr.onsendstream = function(e)
		{
			ind.value = e.progress ;
			Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
		};
		// open the client
		xhr.open('POST','http://127.0.0.1:3000/images');

		// send the data
		xhr.send({'upload[image_file]':image,message:'check me out'});
		
	},
	cancel:function()
	{

	},
	error:function(error)
	{
	},
	allowEditing:true
});
