# git 教程
## Git是什么？
* Git是目前世界上最先进的分布式版本控制系统
* 工作原理/流程：
![](REDMEMD_FILE/git.jpg)
 - workspace:工作区
 - index/stage:暂存区
 - Repository:仓库去（或本地仓库）
 - Remote:远程仓库

## SVN与Git的最主要的区别？ 
- SVN是集中式版本控制系统，版本库是集中放在中央服务器的，而干活的时候，用的都是自己的电脑，所以首先要从中央服务器哪里得到最新的版本，然后干活，干完后，需要把自己做完的活推送到中央服务器。集中式版本控制系统是必须联网才能工作，如果在局域网还可以，带宽够大，速度够快，如果在互联网下，如果网速慢的话，就纳闷了。
- Git是分布式版本控制系统，那么它就没有中央服务器的，每个人的电脑就是一个完整的版本库，这样，工作的时候就不需要联网了，因为版本都是在自己的电脑上。既然每个人的电脑都有一个完整的版本库，那多个人如何协作呢？比如说自己在电脑上改了文件A，其他人也在电脑上改了文件A，这时，你们两之间只需把各自的修改推送给对方，就可以互相看到对方的修改了。

## git基本操作
- 创建版本库：**git init;**
- 将文件添加到暂存区：**git add filename;**
- 将文件提交到仓库：**git commit -m '描述提交内容';**
- 查看文件修改内容：**git diff filename;**
- 查看版本提交记录：**git log;** **git log –pretty=oneline**
- 版本回退：
	+ **git reset --hard HEAD^(回退至上一版本)**
	+ **git reset --hard 版本号**
	+ **git reset --hard HEAD~100(回退至上100个版本)**
- 撤销工作区修改：**git checkout --filename;**
- 本地仓库关联github远程仓库：**git remote add origin https://github.com/repositorypath/repositoryname.git;**
- 本地库内容推送到远程：**git push origin master;第一次推送需要加上-u参数 git push -u origin master;**
- 从远程库克隆本地库：**git clone http://github...;**
- 查看分支：**git branch；**
- 创建分支：**git branch branchname；**
- 切换分支：**git checkout branchname;**
- 创建并切换分支：**git checkout -b branchname；（等于下面两条命令）**
- 合并指定分支到当前分支上:**git merge branchname;  git merge –no-ff -m “注释” dev**
- 删除分支：**git branch –d name;**
- 隐藏工作现场：**git stash;**
- 查看stash：**git stash list**
- 恢复工作现场：**git stash apply; git stash dorp(恢复后删除stash)；**
- 恢复并删除stash:**git stash pop;**
- 创建远程origin分支到本地：**git checkout –b dev（本地分支名字） origin/dev（远程分支名字）;**

## 多人协作工作模式一般是这样的：

首先，可以试图用git push origin branch-name推送自己的修改.
如果推送失败，则因为远程分支比你的本地更新早，需要先用git pull试图合并。
如果合并有冲突，则需要解决冲突，并在本地提交。再用git push origin branch-name推送。
git pull失败，原因是没有指定本地dev分支与远程origin/dev分支的链接，根据提示，设置dev和origin/dev的链接：
git branch --set-upstream dev origin/dev;
