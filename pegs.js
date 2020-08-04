
var boardSize=15;
var cellvalue=-2;
var dirx=new Array(1,0,-1,-1,0,1);
var diry=new Array(0,1,1,0,-1,-1);
var finished=0;
var selectnum=0;
var oldpos=new Array(15);
var pos=new Array(15);
var peg=new Array(15);
var flag = false;

var pegBoardArray=new Array();
pegBoardArray[0]=new Array(0,0);
pegBoardArray[1]=new Array(1,-2);
pegBoardArray[2]=new Array(0,-3);
pegBoardArray[3]=new Array(2,-4);

var images=new Array(4);
images[0]=new Image(32,32);
images[0].src="0.gif";
images[1]=new Image(32,32);
images[1].src="1.gif";
images[2]=new Image(32,32);
images[2].src="3.gif";
images[3]=new Image(32,32);
images[3].src="2.gif";

function getpegnumber(x,y)
{
	if(y>0||y<=-5||x<0||x>-y)
		return-1;
		
	return tno(-y)+x;
}

function getx(num)
{
	var y=gety(num);
	return num+1-y-tno(1-y);
}

function gety(num)
{
	var ctr=0;
	var y;
	for(y=0;y>-5;y--)
	{
		if(num>=ctr&&num<ctr+1-y)
			return y;ctr+=1-y;
	}
	return 1;
}

function ispossiblemove(num)
{
	var conds=0;
	var d;
	var pf;
	var po;
	var p2=1;
	if(pos[num]<2)
		return 0;
		
	for(d=0;d<6;d++)
	{
		po=getpegdir(num,1,d);
		pf=getpegdir(num,2,d);
		if(pf>=0&&(pos[po]&2)&&((pos[pf]&10)==0))
			conds|=p2;p2=p2*2;
	}
	return conds;
}

function getpegdir(num,n,d)
{
	var x=getx(num);
	var y=gety(num);
	return getpegnumber(x+n*dirx[d],y+n*diry[d]);
}

function tno(x) { return(x*(x+1))/2; }
function reflectx(x,y) { return-(x+y); }
function alerting(mess) { document.messageform.alertbox.value=mess; }

function removeselection()
{
	selectnum=0;
	for(i=0;i<15;++i)
		pos[i]&=~1;
}

function gameOutput()
{
	for(i=0;i<boardSize;i++)
	{
		if(oldpos[i]!=pos[i])
		{
			oldpos[i]=pos[i];
			peg[i].src=images[pos[i]].src;
		}
	}
}

function move(num)
{
	var i;
	if(cellvalue<0)
	{
		pos[num]="0";
		cellvalue=num;
		newGame();
	}
	
	if(selectnum)
	{
		for(i=0;i<6;++i)
		{
			if(getpegdir(basenum,2,i)==num&&(selectnum&(1<<i)))
				movePeg(basenum,i);
		}
		if(num==basenum)
			removeselection();
	}
	else if(pos[num]&2)
	{
		selectnum=ispossiblemove(num);
		for(i=0;i<6;++i)
		{
			if(selectnum==(1<<i))
				movePeg(num,i);
		}

		if(selectnum)
		{
			basenum=num;
			pos[num]|=3;
			for(i=0;i<6;++i)
			{
				if(selectnum&(1<<i))
					pos[getpegdir(basenum,2,i)]|=1;
			}
		}
	}
	
	gameOutput();	
	win();
	return false;
}

function movePeg(num,dir)
{
	var i;
	var tohole=getpegdir(num,2,dir);
	var overhole=getpegdir(num,1,dir);
	pos[tohole]=(pos[tohole]|2)&~1;
	pos[overhole]&=~3;
	pos[num]&=~3;
	removeselection();
}

function newGame()
{
	finished=0;
	var i=0;
	var d=document.images;
	boardSize=tno(5);
	if(boardSize>15)
	{
		boardSize=tno(5);
	}
	
	for(i=0;i<15;i++)
	{
		if(i<boardSize)
		{
			pos[i]="2";
			peg[i]=d["img"+i];
		}
		else
			pos[i]="8";
			
		oldpos[i]=-1;
	}
	
	if(cellvalue==-2)
	{
		for(i=0;i<4;i++)
		{
			cellvalue=getpegnumber(pegBoardArray[i][0],pegBoardArray[i][1]);
			break;
		}
	}
	
	if(cellvalue>=0)
		pos[cellvalue]="0";
	
	var message="";
	if(cellvalue<0)
		message="Click on a starting location to set it.";
		
	alerting(message);
	removeselection();
	gameOutput();
}

function newstart()
{
	cellvalue=-1;
	newGame();
}

function win()
{
	var i;
	if(finished)
	{
		alerting("Victory!");
		return;
	}
		
	finished=1;
	var counter=0;
	
	for(i=0;i<boardSize;i++)
	{
		if(pos[i]&2)
		{
			counter++;
			if(ispossiblemove(i))
			{
				finished=0;
				return;
			}
		}
	}
	
	var message="";
	message="Better luck next time!";
	
	if(counter==2)
		message="So close! Try again!";
		
	if(counter==3)
		message="You are improving! Try again!";
		
	alerting(message);
	flag = true;
}

function over(n)
{
	self.status='';
	if(!selectnum)
	{
		if((pos[n]&2)&&ispossiblemove(n) && !flag)
		{
			alerting("That is a legal move.");
			pos[n]|=1;
			gameOutput();
		}
		else if(!flag)
		{
			alerting("That is an illegal move.");
		}
	}
	
	return true;
}

function out(n)
{
	if(!selectnum)
	{
		if(pos[n]&2)
		{
			pos[n]&=~1;
			gameOutput();
		}
	}
	
	return false;
}

window.onload=newGame;