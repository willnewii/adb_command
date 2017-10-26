### command.js
- kill progress by port (一条命令执行执行查询,并杀死进程.)  省的要先查询,再输入相应的端口号.



根据<[🍭 ADB 用法大全](https://github.com/mzlogin/awesome-adb)>这篇文章,把一些常用的命令做了封装.

### 功能
- 查看设备信息
- 查看log
- 查看包名/清除数据/停止应用/获取信息 (模糊查询)
- 查看ip
- 截图(截屏,上传文件,删除)
- 截屏(录屏,上传文件,删除)
- 输入文本

### Dumpsys命令
| 命令           | 功能           |
| ------------- |---------------|
|account	    |accounts信息|
|activity	|所有activities的信息|
|alarm	    |Alarm信息|
|battery	    |电池信息|
|batteryinfo |电量信息及CPU 使用时长|
|cpuinfo	    |CPU信息|
|diskstats	|磁盘相关信息|
|usagestats	|每个界面启动的时间|
|statusbar	|状态栏相关的信息|
|meminfo	    |内存信息（meminfo $package_name or $pid  使用程序的包名或者进程id显示内存信息）|
|package     |packagename	获取安装包信息|
|window	    |键盘，窗口和它们的关系|
|wifi	    |wifi信息|

### 待完成
```
//查看当前Activity
adb shell dumpsys activity activities | grep mFocusedActivity
//
adb shell dumpsys meminfo com.qianyilc.platform
//统计应用的启动时间：
adb shell am start -W 首屏Activity。
//查看所有(6.0)危险权限
adb shell pm list permissions -d -g
```

### 参考资料
- [🍭 ADB Usage Complete / ADB 用法大全](https://github.com/mzlogin/awesome-adb)
- [sed & awk & grep 专题( 鸟哥 )](http://www.cnblogs.com/moveofgod/p/3540575.html)
- [Python 命令行输出的颜色设置 ](http://blog.chinaunix.net/uid-27714502-id-4110758.html)
- [Python_cmd的各种实现方法及优劣（subprocess.Popen, os.system和commands.getstatusoutput）](http://blog.csdn.net/menglei8625/article/details/7494094)
- [工具手册 awk sed grep](http://www.itshouce.com.cn/linux/linux-grep.html)
