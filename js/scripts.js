//---- Custom JS functionalities ----//
'use strict';

(function($){

	$.fn.facebookWall = function(options){

		options = options || {};

		if(!options.id){
			throw new Error('You need to provide an user/page id!');
		}

		if(!options.access_token){
			throw new Error('You need to provide an access token!');
		}

		// Default options of the plugin:

		options = $.extend({
			limit: 25	// You can also pass a custom limit as a parameter.
		},options);

		// Putting together the Facebook Graph API URLs:

		var graphUSER = 'https://graph.facebook.com/'+options.id+'/?fields=name,picture&access_token='+options.access_token+'&callback=?',
			graphPOSTS = 'https://graph.facebook.com/'+options.id+'/posts/?access_token='+options.access_token+'&callback=?&date_format=U&limit='+options.limit;

		var wall = this;

		$.when($.getJSON(graphUSER),$.getJSON(graphPOSTS)).done(function(user,posts){

			// user[0] contains information about the user (name and picture);
			// posts[0].data is an array with wall posts;

			var fb = {
				user : user[0],
				posts : []
			};

			$.each(posts[0].data,function(){

				// We only show links and statuses from the posts feed:
				if((this.type != 'link' && this.type!='status') || !this.message){
					return true;
				}

				// Copying the user avatar to each post, so it is
				// easier to generate the templates:
				this.from.picture = fb.user.picture.data.url;

				// Converting the created_time (a UNIX timestamp) to
				// a relative time offset (e.g. 5 minutes ago):
				this.created_time = relativeTime(this.created_time*1000);

				// Converting URL strings to actual hyperlinks:
				this.message = urlHyperlinks(this.message);

				fb.posts.push(this);


			});


            var loop = fb.posts;



            for (i = 0; i < loop.length; i++) {

                var _postID           = loop[i].id,
                    _pageName         = loop[i].from.name,
                    _pageID           = loop[i].from.id,
                    _pageAvatarUrl    = loop[i].from.picture,
                    _postTime         = loop[i].created_time,
                    _postMessage      = loop[i].message,
                    _extraName        = loop[i].name,
                    _extraLink        = loop[i].link,
                    _extraCaption     = loop[i].caption,
                    _extraDescription = loop[i].description,
                    _extraPicture     = loop[i].picture,
                    _type             = loop[i].type,
                    _sharesCount;

                    if (loop[i].shares == undefined) {
                        _sharesCount = '0';
                    }

                    if (loop[i].shares !== undefined) {
                        _sharesCount = loop[i].shares.count;
                    };

                var pageAvatar  = '<div class="feed__element"> <img class="feed__page-avatar" src="'+ _pageAvatarUrl +'" alt="'+ _pageName +'" />',
                    pageName    = '<div class="feed__status"><h2 class="feed__heading"><a class="feed__heading__link" href="http://www.facebook.com/profile.php?id='+ _pageID +'" target="_blank">' + _pageName + '</a></h2>',
                    postMessage = '<p class="feed__message">'+ _postMessage +'</p>',
                    linkStart   = '<div class="feed__attachment">',
                    linkPicture = '<img class="feed__attachment__picture" src="'+ _extraPicture +'" />',
                    linkContent = '<div class="feed__attachment__content"><p class="feed__attachment__name"><a href="'+ _extraLink +'" target="_blank">'+ _extraName +'</a></p><p class="feed__attachment__caption">'+ _extraCaption +'</p><p class="feed__attachment__description">'+ _extraDescription +'</p></div>',
                    linkEnd     = '</div>',
                    statusEnd   = '</div>',
                    meta        = '<div class="feed__meta"><div class="feed__time">'+ _postTime +'</div><div class="feed__shares">'+ _sharesCount +'</div></div>',
                    feedEnd     = '</div>';
                    var linkData;

                    if(_type == 'link') {
                        linkData = linkStart + linkPicture + linkContent + linkEnd;
                    }

                    var postHTML = pageAvatar + pageName + postMessage + linkData + statusEnd + meta + feedEnd;

                    $( wall ).append(postHTML);

            }

		});

		return this;

	};

	// Helper functions:

	function urlHyperlinks(str){
		return str.replace(/\b((http|https):\/\/\S+)/g,'<a href="$1" target="_blank">$1</a>');
	}

	function relativeTime(time){

		// Adapted from James Herdman's http://bit.ly/e5Jnxe

		var period = new Date(time);
		var delta = new Date() - period;

		if (delta <= 10000) {	// Less than 10 seconds ago
			return 'Just now';
		}

		var units = null;

		var conversions = {
			millisecond: 1,		// ms -> ms
			second: 1000,		// ms -> sec
			minute: 60,			// sec -> min
			hour: 60,			// min -> hour
			day: 24,			// hour -> day
			month: 30,			// day -> month (roughly)
			year: 12			// month -> year
		};

		for (var key in conversions) {
			if (delta < conversions[key]) {
				break;
			}
			else {
				units = key;
				delta = delta / conversions[key];
			}
		}

		// Pluralize if necessary:

		delta = Math.floor(delta);
		if (delta !== 1) { units += 's'; }
		return [delta, units, "ago"].join(' ');

	}

})(jQuery);

	$('#wall').facebookWall({
		id:'jqueryscript',
		access_token:'193673707489176|CSya6L7Q081Uw6OrFfI14AsmfSA'
	});
