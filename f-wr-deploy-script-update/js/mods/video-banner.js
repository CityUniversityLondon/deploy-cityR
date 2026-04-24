var defer = require('./utils/defer'),
	loadYoutubeVideo = require('./video-preview-youtube'),

	getDataAttributes = function(node) {

		var dataAttrRegex = /^data-(.+)$/;            
        var attrs = {};
        $.each(node[0].attributes, function (index, attribute) {
            var match = attribute.name.match(dataAttrRegex);
            if (match) {
                attrs[match[1]] = attribute.value;
            }
        });

        return attrs;
	},

	getService = function(link){
		var href = link.attr('href') || '';
        var params = getDataAttributes(link);

        var ytMatch = href.match(/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/);
        if (ytMatch) {
            return {type: 'youtube', id: ytMatch[1], params: params};
        }

        return null;
	},

	loadVideo = function(wrapper, service) {
		switch (service.type) {
	        case 'youtube':
	            return loadYoutubeVideo(wrapper, service);
	        default:
	            return false;
	    }
	},

    init = function() {
    	var link = $('.video-preview__button');

    	if(link.length){
    		var service = getService(link);

	    	if (service) {
		        var parent = link.parent();
		        var wrapper = null;

		        if (parent.hasClass('video-preview')) {
		            wrapper = parent;
		        } else {
		            wrapper = $('<div/>').addClass('video-preview').insertBefore(link);
		            wrapper.append(link);
		        }

		        link.on('click', function (event) {
					
		        	event.preventDefault();
		            loadVideo(wrapper, service);
		            
		        });
	    	}
		}
    };
defer(init);