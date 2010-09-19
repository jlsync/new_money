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
      // for json: var result = eval('('+this.responseText+')');
			Ti.UI.createAlertDialog({title:'Your Money', message:'result: ' + this.responseText}).show();
			Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);
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
