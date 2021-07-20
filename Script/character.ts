const {ccclass, property} = cc._decorator;

import dF = require("./TypeDefine"); 
import gM = require("./GameManager");

@ccclass
export class Character extends cc.Component {
	
	onLoad():void{
		cc.director.getPhysicsManager().enabled = true;
		cc.director.getCollisionManager().enabled = true;

		this.m_animeB = "null";
		this.m_animeA = "Idle";

		this.m_actVec["Idle"]="Idle";
		this.m_actVec["Move"]="Move";
		this.m_actVec["Attack"]="Attack";
		this.m_actVec["Hurt"]="Hurt";
		this.m_actVec["Dead"]="Dead";

		let bodyBox:cc.Node = this.parent.bodyBox.node;
		let attBox:cc.Node = this.parent.attackBox.node;
		this.m_bodyBox = bodyBox?.getComponents(cc.BoxCollider);
		this.m_attBox = attBox?.getComponents(cc.BoxCollider);

		this.m_animation = cc.getComponent(cc.Animation);

		this.m_status = dF.CUSDefine.State.None;

		this.onIdle();
	}

	update(dt:number):void{
		
	}

	@property({displayName:"BaseHeaNum"})
	m_baseHeaNum:number = 5;
	m_offsetHeaNum:number = 0;

	@property({displayName:"BaseSepNum"})
	m_baseSepNum:number = 50;
	m_offsetSepNum:number = 0;

	@property({displayName:"BaseAttNum"})
	m_baseAttNum:number = 1;
	m_offsetAttNum:number = 0;

	@property({displayName:"CharaterLevel"})
	m_baseJumpHeight:number = 15;
	m_offsetHeaNum:number = 0;

	@property({displayName:"CharaterLevel"})
	m_baseLevel:number = 1;

	// 当前和上一个动画暂存
	m_animeA:string;
	m_animeB:string;

	// 当前状态
	m_status:dF.CUSDefine.State;

	// 动画组件
	m_animation:cc.Animation;

	// 碰撞体组件
	m_bodyBox:cc.BoxCollider[];
	m_attBox:cc.BoxCollider[];

	// 行为动作
	[m_actVec:string]:string;

	// 输入按键
	m_Inputkey:number[];

	// 行为树
	public StateTree():void{
		
	}

	public onIdle(change:boolean = false):boolean{
		if(!this.onChangeStatus("Idle",change))
			return false;
		
		this.m_animation.play(this.m_actVec["Idle"]);
	}

	public onMove(change:boolean = false):boolean{

		return false;
	}

	public onJump(change:boolean = false):boolean{

		return false;
	}

	public onAttack(change:boolean = false):boolean{

		return false;
	}	

	public onHurt(change:boolean = false):boolean{

		return false;
	}

	public onDead(change:boolean = false):boolean{
		return false;
	}

	private onChangeStatus(action:string,change:Boolean):boolean{
		if(this.m_animeA == this.m_animeB && change == false){
			return false;
		}

		this.m_animeB = this.m_animeA;
		this.m_animeA = action;
		this.m_status = dF.CUSDefine.StatusVec[this.m_animeA];
		return true;
	}

	public AttBoxAniCallBack(id:number,x:number,y:number,w:number,h:number):void{
		let boffset:cc.Vec2 = cc.v2(x,y);
		let bsize:cc.Size = cc.size(w,h);
		this.m_attBox[id]?.offset = boffset;
		this.m_attBox[id]?.size = bsize;
	}

	public ColiBoxAniCallBack(id:number,x:number,y:number,w:number,h:number):void{
		let boffset:cc.Vec2 = cc.v2(x,y);
		let bsize:cc.Size = cc.size(w,h);
		this.m_bodyBox[id]?.offset = boffset;
		this.m_bodyBox[id]?.size = bsize;
	}
};