// 图片预加载
(function ($) {
  function PreLoad(imgs, options) {
  	this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
  	this.opts = $.extend({}, PreLoad.DEFAULTS, options);

    // 方法加_表明，只在内部使用，而不提供外部调用
  	if (this.opts.order === 'ordered') {
      this._ordered();
    } else {
      this._unordered()
    }
  }
  PreLoad.DEFAULTS = {
    order: 'unordered', // 无序预加载
  	each: null, // 每一张图片加载完毕后执行
  	all: null // 所有图片加载完毕后执行
  };
  // 方法写在原型上，每次实例化的时候都可以保持一份
  PreLoad.prototype._ordered = function () { // 有序加载
    var opts = this.opts,
        imgs = this.imgs,
        len = imgs.length,
        count = 0;
    load();
    // 有序预加载
    function load() {
      var imgObj = new Image();
      // 每次图片加载完成或错误执行的代码
      $(imgObj).on('load error', function () {
        opts.each && opts.each(count);

        if(count >=len) {
          // 所有图片已经加载完毕
          opts.all && opts.all();
        } else {
          load();
        }
        count++;
      });

      imgObj.src = imgs[count];
    }
  }
  PreLoad.prototype._unordered = function () { // 无序加载
    var imgs = this.imgs,
        opts = this.opts,
        count = 0,
        len =imgs.length;

  	$.each(imgs, function (i,src) {
  		if(typeof src != 'string') return;
		  var imgObj = new Image();
		  // Image对象有两个事件，如果图片被正常加载会触发一个load事件；如果没被正常加载会触发error事件
		  $(imgObj).on('load error', function (){
        // 如果存在的话，再去执行它
        opts.each && opts.each(count);

			if (count >= len-1) {
			   opts.all && opts.all();
			}
			count++;
		});
		imgObj.src = src;
	});
  };

  // $.fn.extend -> $('#img').preload()
  // $.extend -> $.preload()
  $.extend({
  	preload: function (imgs, opts) {
  	  new PreLoad(imgs, opts)
  	}
  });
})(jQuery);