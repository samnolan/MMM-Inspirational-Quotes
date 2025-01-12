Module.register("MMM-Inspirational-Quotes", {

	defaults: {
		"update_interval": 0,
		"transition_interval": 2000,
		//"size": "500px"
	},

	start: function(){
		this.quote_url = {};
		this.sessionID = "";
		this.dataurl = "http://www.inspirobot.me/api?generateFlow=1&sessionID="
		this.size = this.config.size;
		this.update_interval = this.config.update_interval;
		this.transition_interval = this.config.transition_interval;
		this.interval = 0;

		this.init_quote()
	},

	next_quote: function(){
		const self = this;
		self.get_sessionID;
		self.get_new_url()
			.then(res => {
				self.updateDom(self.transition_interval)
			})
	},

	init_quote: function(){
		const self = this;
		self.next_quote()

		if(self.update_interval > 0){
			self.interval = setInterval(() => {
				self.next_quote()
			}, self.update_interval)
		}
	},

	get_new_url: function(){
		const self = this;

		url = self.dataurl
		return new Promise((resolve, reject) => {
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					self.quote_url = xmlhttp.response;
					resolve(xmlhttp.response);
				}
			};

			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		})
	},
	
	get_sessionID: function(){
		const self = this;
		
		url = "http://www.inspirobot.me/api?getSessionID=1"
		return new Promise((resolve, reject) => {
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					self.sessionID = xmlhttp.response;
					self.dataurl += self.sessionID;
					resolve(xmlhttp.response);
				}
			};

			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		})
	},

	getDom: function(){
		const self = this;
		Log.log("Updating MMM-Inspirational-Quotes DOM.");
		
		
		const wrapper = document.createElement("div");
		wrapper.className = "wrapper";
		let quoteTextDiv = document.createElement("div");
		quoteTextDiv.className = "normal";
		quoteTextDiv.innerHTML = self.quote_url.data.text;
		wrapper.appendChild(quoteTextDiv);
		/*if(self.quote_url.length > 0){
			photo = document.createElement("img")
			photo.src = self.quote_url
			photo.style.height = self.size
			photo.style.width = self.size
			wrapper.appendChild(photo)
		}*/
		
		return wrapper;
	},

	notificationReceived: function(notification, payload){
		const self = this;

		if(notification == "NEXT_QUOTE"){
			self.next_quote()
		}
	}
})
