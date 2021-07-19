const {ccclass, property} = cc._decorator;

import dF = require("./TypeDefine"); 
import gM = require("./GameManager");

@ccclass
export class Character extends cc.Component {
	
	onLoad():void{
		this.m_animeB = "null";
		this.m_animeA = "Idle";

		cc.Node bodyBox = this.parent.bodyBox.node;
		cc.Node AttBox = this.parent.attackBox.node;
		this.m_BodyBox = bodyBox?.getComponents(cc.BoxCollider);
		this.m_AttBox = AttBox?.getComponents(cc.BoxCollider);

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
	m_BodyBox:cc.BoxCollider[];
	m_AttBox:cc.BoxCollider[];

	// 行为树
	public StateTree():void{
		
	}

	public onIdle():boolean{
		if(!this.onChangeStatus("Idle"))
			return false;
		
		this.m_animation.play("Idle");
	}

	public onMove():boolean{

		return false;
	}

	public onJump():boolean{

		return false;
	}

	public onAttack():boolean{

		return false;
	}	

	public onHurt():boolean{

		return false;
	}

	public onDead():boolean{
		return false;
	}

	private onChangeStatus(action:string):boolean{
		if(this.m_animeA == this.m_animeB){
			return false;
		}

		this.m_animeB = this.m_animeA;
		this.m_animeA = action;
		this.m_status = dF.CUSDefine.StatusVec[this.m_animeA];
		return true;
	}

	public AttBoxUpdate(id:number,x:number,y:number,w:number,h:number):void{

	}

	public ClyBoxUpdate(id:number,x:number,y:number,w:number,h:number):void{
		
	}
};