// pages/page2.js
const APP = getApp();
const request = require('../../utils/util.js').request;
const URL = 'https://liudongtushuguan.cn/';
Page({
  data: {
    winHeight: '',//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    showBooks : [], //获取的书籍
    tags: ['全部', '文学', '流行', '文化', '生活', '经管', '科技','编程'], //书籍分类
    currentPages : [], //记录当前tab分页查询当前page
  },
  // 滚动主页面切换页面和切换导航栏标题--通过onshow()的监听事件同步更新
  switchTab: function (e) {
    let index = e.detail.current;//第几个主页面或者是导航栏的第几个标题
    this.setData({
      currentTab: index
    });
    // 滚动主页面切换导航栏标题--通过onshow()的监听事件同步更新
    this.checkCor();
    if (!this.data.showBooks[index]){
      this.getBooks(this.data.tags[index], index);
    }
  },
  // 点击标题栏标题切换主页面
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    };
    // this.getBooks(this.data.tags[cur], cur);
  },
  //判断当前滚动超过一屏时，设置tab标题左移300。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    //初始化加载页面为标题下标为0（即全部）的主页面
    // console.log('books-----------');
    this.getBooks(this.data.tags[0],0);
    var that = this;
   
    // 高度自适应  当前主页面高度距离顶部80rpx
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res);
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth;
          //rpxR = 750 / clientWidth;
        //var calc = clientHeight * rpxR - 180;
        //console.log(calc)
        that.setData({
          winHeight: clientHeight-40,
        });
      }
    });
  },
  // footerTap: app.footerTap
  footerTap : function (){
    
  },
  //tag : 种类
  //index : 种类对应的索引
  getBooks : function(tag,index,currentPage=0){
    let that = this;
    if(tag === '全部') tag = 'all';
    request({
      url : URL+'books?tag='+tag+'&currentPage='+currentPage,
      success : function(res){
        if(res.statusCode === 200){
          let showBooks = that.data.showBooks;
          showBooks[index] = currentPage ? showBooks[index].concat(res.data.books) : res.data.books;
          that.data.currentPages[index] = currentPage;
          that.setData({
            showBooks : that.data.showBooks,
            currentPages : that.data.currentPages
          });
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
        }
      },
    });
  },
  toBorrowBook : function(e){
    //dataset会将变量变为全部小写
    let isbn = e.currentTarget.dataset.isbn;
    let bookId = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: './borrowBook/index?isbn=' + isbn + '&bookId=' + bookId,
    }) 
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作--下拉刷新
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh');
    let data = this.data;
    wx.showNavigationBarLoading();
    this.getBooks(data.tags[data.currentTab],data.currentTab);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let data = this.data;
    if (APP.globalData.libraryUpdate){
      APP.globalData.libraryUpdate = false;
      this.getBooks(data.tags[data.currentTab], data.currentTab);
    }
  },
  refresh : function(){
    console.log('refresh');
    //wx.startPullDownRefresh();
  },
  onReachBottom : function(){
    console.log('onReachBottom');
  },
  onPageScroll : function(){
    console.log('onpageScroll');
  }
})