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

Titanium.Media.showCamera({

	success:function(event)
	{
		var image = event.media;

		Ti.API.debug('Our type was: '+event.mediaType);
		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
		{
			var imageView = Ti.UI.createImageView({width:win.width,height:win.height,image:event.media});
			win.add(imageView);  

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

			Ti.API.info('The response is: ' + this.responseText );
      var result = JSON.parse(this.responseText);
      var amount = result.total_money;
			Ti.UI.createAlertDialog({title:'Your Money', message:'amount: ' + amount}).show();
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
              //top:280,
              //right:20,
              //left:150,
              height:26,
              width:92
          });
          
      PayPalButton.addEventListener('click',function(e) {

      //open link in safari - application will close
      // justgiving 2344 is WWF UK
      var url = 'http://www.justgiving.com/donation/direct/charity/2344?frequency=single&amount=' + amount ;
			Ti.API.info('url is  ' + url );
      Titanium.Platform.openURL(url);
      });

     win.add(PayPalButton);

		};

		xhr.onsendstream = function(e)
		{
			ind.value = e.progress ;
			Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
		};
		// open the client
		xhr.open('POST','http://192.168.109.165:3000/images');

		// send the data
		xhr.send({'upload[image_file]':image,message:'check me out'});



		}
		else
		{
			alert("got the wrong type back ="+event.mediaType);
		}
	},
	cancel:function()
	{
	},
	error:function(error)
	{
		// create alert
		var a = Titanium.UI.createAlertDialog({title:'Camera'});

		// set message
		if (error.code == Titanium.Media.NO_CAMERA)
		{
			a.setMessage('Please run this test on device');
		}
		else
		{
			a.setMessage('Unexpected error: ' + error.code);
		}

		// show alert
		a.show();
	},
	saveToPhotoGallery:true,
	allowEditing:false,
	mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO],
});
