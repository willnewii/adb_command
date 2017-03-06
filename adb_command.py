# encoding: UTF-8
import os
import sys
import subprocess
import time
import re           #正则表达式

ads = 'adb shell '

def _command(command):
    #os.system('adb devices')
    #os.popen('adb devices').read()
    status, output = subprocess.getstatusoutput(command)
    return output

#输出设备信息
def deviceInfo():
    brand = _command(ads + 'getprop ro.product.brand')
    name = _command(ads + 'getprop ro.product.name')
    model = _command(ads + 'getprop ro.product.model')
#    print('%s %s (%s)' % (brand,model,name))
    print ('品牌:' + brand)
    print ('型号:' + model)
    print ('代号:' + name)
    print ('系统版本:' + _command(ads + 'getprop ro.build.version.release') + ',' + _command(ads + 'getprop ro.build.version.sdk'))
    print ('屏幕密度:' + _command(ads + 'wm density'))
    print ('屏幕分辨率:' + _command(ads + 'wm size'))

#输出IP地址
def deviceIP():
    os.system(ads + 'ifconfig | grep Mask')

#屏幕截图
def screencap():
    fileName = time.strftime("%Y_%m_%d_%H_%M_%S", time.localtime());
    os.system(ads + 'screencap -p /sdcard/' + fileName + '.png')
    os.system('adb pull /sdcard/' + fileName + '.png')
    os.system(ads + 'rm /sdcard/' + fileName + '.png')

#录制屏幕
def screenrecord():
    print('屏幕录制中...需要停止时按ctrl+c')
    fileName = time.strftime("%Y_%m_%d_%H_%M_%S", time.localtime());
    os.system(ads + 'screenrecord /sdcard/' + fileName + '.mp4')
    time.sleep(1)
    os.system('adb pull /sdcard/' + fileName + '.mp4')
    os.system(ads + 'rm /sdcard/' + fileName + '.mp4')

#显示包列表
#word:搜索关键字
def packages(word):
    if len(word)==0:
        os.system(ads + 'pm list packages')
    else:
        os.system(ads + 'pm list packages | grep ' + word)

def apkInfo(package):
    if len(package)==0:
        print('抱歉,请输入你要搜索的包名')
    else:
        com = ads + 'pm list packages ' + package + "| awk -F ':' '{print $2}'"
        packagesStr = _command(com)

        if len(packagesStr)==0:
            print('没有匹配到包:' + package)
        else:
            packages = packagesStr.split('\n')
            for index in range(len(packages)):
                print(index,packages[index])

            num = int(input("请选择你要查询应用:"))
            os.system("adb shell dumpsys package " + packages[num])

def inputtext(text):
    os.system("adb shell input text " + text)


def apkUtil(package):
    print('apkUtil')
    #基本信息:版本,安装时间
    #adb shell dumpsys package com.qianyilc.platform | grep -n 'version\|firstInstallTime'
    #停止应用
    #adb shell am force-stop package

#输出帮助信息
def printHelp():
    print('方法列表:')
    print('info             ·········  获取设备信息')
    print('apkinfo          ·········  获取指定包名的apk信息 支持模糊查询')
    print('ip               ·········  获取ip信息')
    print('text             ·········  将内容输入到edittext')
    print('packages         ·········  获取安装包列表 可跟关键字. eg:packages weibo')
    print('cap              ·········  截取当前屏幕,保存在当前目录,然后删除手机中的截图文件')
    print('screenrecord     ·········  录制当前屏幕,保存在当前目录,然后删除手机中的录屏文件')
    print('v 0.0.2 2017年03月06日16:55:36')

def test():
    result = _command('adb shell dumpsys package com.qianyilc.platform')
    print(result)
    match = re.findall('MAIN:.*:',result,flags=re.DOTALL+re.MULTILINE)
    print(match)
'''
    print (time.strftime("%Y_%m_%d_%H_%M_%S", time.localtime()))
    os.system(ads + 'input keyevent 64')
    os.system(ads + 'input keyevent 99')
    os.system(ads + 'input text aaaa')
'''

if len(sys.argv) ==1:
    deviceInfo()
elif sys.argv[1]=='info':
    deviceInfo()
elif sys.argv[1]=='cap':
    screencap()
elif sys.argv[1]=='ip':
    deviceIP()
elif sys.argv[1]=='packages':
    if len(sys.argv) ==2:
        packages('')
    else:
        packages(sys.argv[2])
elif sys.argv[1]=='help':
    printHelp()
elif sys.argv[1]=='screenrecord':
    screenrecord()
elif sys.argv[1]=='apkinfo':
    if len(sys.argv) ==2:
        apkInfo('')
    else:
        apkInfo(sys.argv[2])
elif sys.argv[1]=='text':
    if len(sys.argv) ==2:
        inputtext('')
    else:
        inputtext(sys.argv[2])
elif sys.argv[1]=='test':
    test()
else:
    print('未匹配到命令')
    printHelp()
