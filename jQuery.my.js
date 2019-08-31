/* 

实现简单的jquery

*/

// 实现一个选择器，返回一个伪数组


function $(selector) {
  // new Init()是一个实例对象
  return new Init(selector)
}


// 定义一下我们自己的一个构造函数
function Init(selector) {
  // 获取
  let dom = document.querySelectorAll(selector);
  // 我们要构建一个自己的伪数组
  // 然后一个一个添加到我的对象里面    伪数组的本质————以数字为键的对象
  dom.forEach((e, i) => {
    this[i] = dom[i]
  })
  this.length = dom.length;
}


/* 
  实现jq里面的each方法(隐式迭代)，我们也要封装一个
  jq里面的的each方法的语法  jq对象.each(function(){})
*/
Init.prototype.each = function (fn) {
  for (let i = 0; i < this.length; i++) {
    fn(i, this[i]);
  }
  return this;
}

/* 
  封装行内样式操作
  jq里面的css方法，
    两个功能：获取，修改
      获取样式就是传递一个参数
      修改就是传递两个参数
*/
Init.prototype.css = function (property, value) {
  // 判断传入参数
  if (value === undefined) {
    // 获取任意样式
    let cssStyle = window.getComputedStyle(this[0])
    return cssStyle[property];
  } else {
    // 对象修改属性
    this.each((i, e) => {
      e.style[property] = value;
    })
  }

}


/* 
  封装类样式操作
  添加类
  jq里面的addClass
  jq对象.addClass(类名)
*/
Init.prototype.addClass = function (className) {
  this.each((i, e) => {
    // 添加类名
    e.classList.add(className);
  })
}


/* 
  删除类样式的操作
  jq里面的removeClass
  jq对象.removeClass(类名)
*/
Init.prototype.removeClass = function (className) {
  this.each((i, e) => {
    e.classList.remove(className);
  })
}


/* 
  切换类样式
  jq里面的toggleClass
  jq对象.toggleClass(类名)
 */
Init.prototype.toggleClass = function (className) {
  this.each((i, e) => {
    e.classList.toggle(className);
  })
}




/* 
  封装注册事件的方法
  jq里面的注册事件
    jq对象.on(事件类型,处理程序)
  事件委托
    jq对象.on(事件类型，后代元素的选择器,处理程序)
*/
Init.prototype.on = function (type, selector, fn) {
  // 判断是否传递了两个参数
  if (fn === undefined) {
    // fn = selector;
    // 如果是我就仅仅是注册事件
    this.each((i, e) => {
      e.addEventListener(type, selector)
    });
  } else {
    /* 
    否则就是事件委托
    事件委托就是给前代元素注册事件，判断事件目标是否满足条件，如果满足才执行代码
    */
    //  还是jq对象注册事件
    this.each((i, e) => {
      e.addEventListener(type, function (event) {
        /* 
        如果触发事件的事件目标(jq对象.target)，在根据后代元素选择器获取伪数组里面，
        证明触发事件的事件目标就是 满足条件 的
        */
        // 获取我后代元素，就是把传进来的selector先获取
        let list = document.querySelectorAll(selector);
        // 借用indexOf方法查询我后代元素是否存在这个元素
        let isEixt = Array.prototype.indexOf.call(list, event.target) != -1;
        if (isEixt) {
          // 证明我的后代元素存在我的事件目标，就执行我代码
          fn.call(e.target);
        }
      });
    });
  }


}

/* 
封装获取修改非开关属性的方法
  获取和修改
  传一个参数为获取，两个为修改
  获取：jq对象.attr(属性名)
  修改：jq对象.attr(属性名,属性值)
 */
Init.prototype.attr = function (property, value) {
  // 判断传入的参数是否存着value
  if (value === undefined) {
    // 先定义一个变量,用来存值
    // 返回我这个获取属性的值
    return this[0].getAttribute(property);
  } else {
    this.each((i, e) => {
      // 修改我属性值
      e.setAttribute(property, value);
    })
    return this;
  }
}




/* 
封装获取修改开关属性的方法
  获取和修改
  传一个参数为获取，两个为修改
  获取：jq对象.prop(属性名)
  修改：jq对象.prop(属性名,属性值)
 */

Init.prototype.prop = function (property, value) {
  if (value === undefined) {
    // 返回我这个获取属性的值
    return this[0][property];
  } else {
    this.each((i, e) => {
      // 修改我属性值
      console.log(e)
      // e.setAttribute(property, value)
      e[property] = value
      return this;
    })
  }
}


/* 
  封装操作非表单元素的内容  text方法
  获取  不用传参数
    jq对象.text()
  设置  传参
    jq对象.text(内容)
*/
Init.prototype.text = function (content) {
  // 传入的值一定要是字符串
  // 判断是否传入了参数content，没有传入就是undefined
  if (content === undefined) {
    return this[0].innerText;
  } else {
    this.each((i, e) => {
      // 原生js里面设置内容的新的值innerText = 新的值;
      e.innerText = content;
    })
    // 返回我修改之后的一个结果
    return this;
  }
}





/* 
  封装操作非表单元素的内容  html方法
  获取  不用传参数
    jq对象.html()
  设置  传参
    jq对象.html(内容)

*/
Init.prototype.html = function (elements) {
  // 传入的值一定要是字符串
  // 判断是否传入了参数content，没有传入就是undefined
  if (elements === undefined) {
    // 原生js里面获取文本内容innerHTML
    // 返回设置之后的一个结果
    return this[0].innerHTML;
  } else {
    // 原生js里面设置内容的新的值innerHTML = 新的值;
    // 返回我修改之后的一个结果
    this[0].innerHTML = elements
    return this;
  }
}



/* 
  封装操作表单元素的内容  val方法
  获取  不用传参数
    jq对象.val()
  设置  传参
    jq对象.val(新的内容)
*/
Init.prototype.val = function (value) {
  // 传入的值一定要是字符串
  // 判断是否传入了参数content，没有传入就是undefined
  if (value === undefined) {
    // 原生js里面获取文本内容innerHTML
    // 返回设置之后的一个结果
    return this[0].value;
  } else {
    // 原生js里面设置内容的新的值innerHTML = 新的值;
    this[0].value = value;
    // 返回我修改之后的一个结果
    return this;
  }
}