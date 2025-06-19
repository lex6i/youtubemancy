const https = require("http");
require("dotenv").config();

const host = "0.0.0.0";
const port = process.env.PORT || 3030;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Http = new XMLHttpRequest();
const Http2 = new XMLHttpRequest();
const apiKey = process.env.API_KEY;

let videoId = ""
let videoLength = 0


const requestListener = async function (req, res) {
	console.log("new request")
	//link = await getVideo()
	//res.write(getVideo())
	//
	
	var query = getRandomText()
	const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&maxResults=10&part=snippet&type=video&q=${query}`
	Http.open("Get", url);
	Http.send();
	Http.onreadystatechange=function(){
		if(Http.readyState == 4 && this.status==200){
			//console.log(Http.responseText)
			const j = JSON.parse(Http.responseText);
			const l = j.items.length;
			let r = Math.floor(Math.random()*l);
			videoId = j.items[r].id.videoId;
			//console.log(videoId)
			const url2 = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`
	Http2.open("Get", url2);
	Http2.send();
	Http2.onreadystatechange=function(){
		if(Http2.readyState == 4 && this.status==200){
			const j = JSON.parse(Http2.responseText);
			//console.log(j.items[0])
			const dur = j.items[0].contentDetails.duration;
			videoLength = formatDuration(dur);
			let timestamp = Math.floor(
				Math.random()*(videoLength-10)
			);
			res.writeHead(302, {
				'location': `https://youtu.be/${videoId}?t=${timestamp}`
			})
			res.end()
			//res.end(`https://youtu.be/${videoId}?t=${timestamp}`)
		}

	}

						
		}
		else if(Http.readyState == 4 && this.status != 200){
			console.log(this.status);
		}

	}


	//console.log(link)
	//console.log(getVideo())
  	//res.writeHead(200)
	//res.end(link)
}

const server = https.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

async function getVideo(){
	var query = getRandomText()
	const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&maxResults=10&part=snippet&type=video&q=${query}`
	Http.open("Get", url);
	Http.send();
	Http.onreadystatechange=function(){
		if(Http.readyState == 4 && this.status==200){
			//console.log(Http.responseText)
			const j = JSON.parse(Http.responseText);
			const l = j.items.length;
			let r = Math.floor(Math.random()*l);
			videoId = j.items[r].id.videoId;
			//console.log(videoId)
			return getAdditionalInfo()
						
		}
		else if(Http.readyState == 4 && this.status != 200){
			console.log(this.status);
		}

	}

}

function getAdditionalInfo(){
	const url2 = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`
	Http2.open("Get", url2);
	Http2.send();
	Http2.onreadystatechange=function(){
		if(Http2.readyState == 4 && this.status==200){
			const j = JSON.parse(Http2.responseText);
			//console.log(j.items[0])
			const dur = j.items[0].contentDetails.duration;
			videoLength = formatDuration(dur);
			let timestamp = Math.floor(
				Math.random()*(videoLength-10)
			);
			return `https://youtu.be/${videoId}?t=${timestamp}`
		}

	}

}

function getRandomText() {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var len = Math.floor((Math.random()*5)+1);
	var output = ""
	for(let i = 0; i < len; i++){
		output += characters.charAt(
			Math.floor(Math.random()*characters.length)
		)
	}
	return output
}

function formatDuration(i){
	//3M13S
	i = i.substring(2);
	o = 0;

	if(i.includes('M')){
		m = parseInt(i.split('M')[0])*60
		o += m
		i = i.split('M')[1]
	}

	i = i.substring(0, i.length-1)
	s = parseInt(i);

	o += s;

	return o;
}

