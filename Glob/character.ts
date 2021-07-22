const {ccclass, property} = cc._decorator;

import dF = require("./TypeDefine"); 
import gM = require("./GameManager");

@ccclass
export class Character extends cc.Component {
	
	onLoad():void{
		cc.director.getPhysicsManager().enabled = true;
		cc.director.getCollisionManager().enabled = true;

		this.m_isJumped = false;
		this.m_isAttack = false;
		this.m_canBeHurt = true;

		this.m_direction = cc.vec2(0,0);

		this.m_animeB = "null";
		this.m_animeA = "Idle";
		this.m_playAnime = "null";

		this.m_actVec["Idle"]="Idle";
		this.m_actVec["Move"]="Move";
		this.m_actVec["Attack"]="Attack";
		this.m_actVec["Hurt"]="Hurt";
		this.m_actVec["Dead"]="Dead";

		let hitBox:cc.Node = this.parent.getChildByName("hitBox");
		let attBox:cc.Node = this.parent.getChildByName("attBox");

		this.m_hitBox = hitBox?.getComponents(cc.BoxCollider);
		this.m_attBox = attBox?.getComponents(cc.BoxCollider);
		this.m_rigidBody = this.parent.getComponent(cc.RigidBody);
		this.m_animation = cc.getComponent(cc.Animation);

		this.m_status = dF.CUSDefine.State.None;

		this.m_AnimFinishedCB=this.m_AnimFinishedCB;

		this.m_animation.on("finished",this.m_AnimFinishedCB,this);

		this.onIdle();
	}

	update(dt:number):void{
		this.KeyPress();
		let stat:dF.CUSDefine.State;
		stat = this.StateTree();
		this.UpdateMotion(stat);
		this.m_animation.play(this.m_playAnime);
	}

	onDestroy():void{

	}

	@property({displayName:"BaseHeaNum"})
	m_baseHeaNum:number = 5;		// 基础血量
	m_effsetHeaNum:number = 0;		// 增值率
	m_offsetHeaNum:number = 1;		// 额外血量
	m_heaNum:number = 5;			// 当前血量

	@property({displayName:"BaseAttNum"})
	m_baseAttNum:number = 1;
	m_effsetAttNum:number = 0;
	m_offsetAttNum:number = 1;

	@property({displayName:"BaseSepNum"})
	m_baseSepNum:number = 50;
	m_offsetSepNum:number = 1;

	@property({displayName:"BaseJumpNum"})
	m_baseJumpHeight:number = 15;
	m_offsetJumpHeight:number = 0;

	@property({displayName:"CharaterLevel"})
	m_Level:number = 1;

	// 位置方向
	m_direction:cc.Vec2;

	// 是否按下攻击
	m_isAttack:boolean;

	// 是否正在跳跃
	m_isJumped:boolean;

	// 是否可以收到伤害
	m_canBeHurt:boolean;

	// 打击感等级
	m_hitLevel:number;

	// 当前和上一个动画暂存
	m_animeA:string;
	m_animeB:string;
	m_playAnime:string;

	// 刚体
	m_rigidBody:cc.RigidBody;

	// 当前状态
	m_status:dF.CUSDefine.State;

	// 动画组件
	m_animation:cc.Animation;

	// 碰撞体组件
	m_hitBox:cc.BoxCollider[];
	m_attBox:cc.BoxCollider[];

	// 行为动作
	[m_actVec:string]:string;

	// 输入按键
	m_Inputkey:number[];

	m_AnimFinishedCB:function(type:string,data:cc.AnimationState):void;

	// 额外伤害 + (基础伤害+(等级*增值率))
	getDamage():number{
		return this.m_effsetAttNum + (this.m_baseAttNum + (this.m_Level*this.m_offsetAttNum));
	}

	getMaxHeath():number{
		return (this.m_effsetHeaNum + (this.m_baseHeaNum +(this.m_Level * this.m_offsetHeaNum)));
	}

	getHeath():number{
		return this.m_heaNum;
	}

	getSpeed():number{
		return this.m_baseSepNum + this.m_offsetSepNum;
	}

	getJumpHeight():number{
		return this.m_baseJumpHeight + this.m_offsetJumpHeight;
	}

	// 行为树
	public StateTree():dF.CUSDefine.State{
		let stat:dF.CUSDefine.State;

		stat = dF.CUSDefine.State.None;
		
		if(this.m_isAttack){
			stat = dF.CUSDefine.State.Attack;
		}else if(this.m_direction != cc.vec2(0,0)){
			stat = dF.CUSDefine.State.Move;
		}else{
			stat = dF.CUSDefine.State.Idle;
		}

		if(stat <= this.m_status){
			return dF.CUSDefine.State.None;
		}

		return stat;
	}

	// 行为执行
	public UpdateMotion(stat:dF.CUSDefine.State):void{
		switch(stat){
			case dF.CUSDefine.State.Idle:
				this.onIdle();
				break;
			case dF.CUSDefine.State.Move:
				this.onMove();
				break;
			case dF.CUSDefine.State.Attack:
				this.onAttack();
				break;
			default:
				break;
		}
	}

	// 按键设置
	public KeyPress():void{
		let moveR:number = this.m_Inputkey[cc.marco.KEY.d];
		let moveL:number = this.m_Inputkey[cc.marco.KEY.a];
		let moveU:number = this.m_Inputkey[cc.marco.KEY.w];
		let att:number = this.m_Inputkey[cc.marco.KEY.j];

		this.m_direction = cc.vec(0,0);
		if(moveR){this.m_direction.x++;}
		if(moveL){this.m_direction.x--;}
		if(moveU){this.m_direction.y = moveU;}

		if(att){this.m_isAttack = true;}
		else {this.m_isAttack = false;}
	}

	public onIdle(change:boolean = false):boolean{
		let action:string = this.m_actVec["Idle"];
		if(!this.onChangeStatus(action,change))
			return false;
		
		this.m_playAnime = action;
	}

	public onMove(change:boolean = false):boolean{
		let action:string = this.m_actVec["Move"];
		let speed = this.getSpeed() * this.m_direction.x;
		let isjump:boolean = this.m_direction.y == 1 ? true:false;
		let linear:cc.Vec2 = new cc.vec2(0,0);
		
		if(!this.onChangeStatus(action,change)){
			return false;
		}

		linear.y = 0;
		if(isjump && this.m_isJumped == false){
			linear.y = this.getJumpHeight();
		}
		linear.x = speed;

		this.m_rigidBody.linearVelocity = linear;
		this.scaleX = this.m_direction.x;

		if(this.m_isJumped){
			return this.onJump();
		}
		
		this.m_playAnime = action;
		return true;
	}

	public onJump(change:boolean = false):boolean{
		this.m_playAnime = action;
		return true;
	}

	public onAttack(change:boolean = false):boolean{
		let action:string = this.m_actVec["Attack"];
		if(!this.onChangeStatus(action,change)){
			return false;
		}

		this.m_playAnime = action;
		return true;
	}	

	public onHurt(event:dF.CUSDefine.AttEvent,change:boolean = false):boolean{
		let action:string = this.m_actVec["Hurt"];
		if(!this.m_canBeHurt || !this.onChangeStatus(action,change))
			return false;

		event.hitNode = this.node;
		let GameInstn:gM.Global.GameRule = gM.Global.GameRule.getInstance();
		GameInstn.nodeSTCallBack(event);
		this.m_heaNum -= event.damage;

		if(this.getHeath() <= 0){
			return this.onDead();
		}

		this.m_playAnime = action;
		return true;
	}

	public onDead(change:boolean = false):boolean{
		return false;
	}

	private onChangeStatus(action:string,change:Boolean):boolean{
		if(action == "null"){
			return false;
		}

		if(this.m_animeA == this.m_animeB && change == false){
			return false;
		}

		this.m_animeB = this.m_animeA;
		this.m_animeA = action;
		this.m_status = dF.CUSDefine.StatusVec[this.m_animeA];
		return true;
	}

	public onAttBoxAniCallBack(id:number,x:number,y:number,w:number,h:number):void{
		if(id == -1){
			this.m_attBox.forEach((box:cc.BoxCollider)=>{
				let boffset:cc.Vec2 = cc.v2(x,y);
				let bsize:cc.Size = cc.size(w,h);
				this.box.offset = boffset;
				this.box.size = bsize;
			});
			return;
		}

		let boffset:cc.Vec2 = cc.v2(x,y);
		let bsize:cc.Size = cc.size(w,h);
		this.m_attBox[id]?.offset = boffset;
		this.m_attBox[id]?.size = bsize;
	}

	public onColiBoxAniCallBack(id:number,x:number,y:number,w:number,h:number):void{
		if(id == -1){
			this.m_hitBox.forEach((box:cc.BoxCollider)=>{
				let boffset:cc.Vec2 = cc.v2(x,y);
				let bsize:cc.Size = cc.size(w,h);
				this.box.offset = boffset;
				this.box.size = bsize;
			});
			return;
		}

		let boffset:cc.Vec2 = cc.v2(x,y);
		let bsize:cc.Size = cc.size(w,h);
		this.m_hitBox[id]?.offset = boffset;
		this.m_hitBox[id]?.size = bsize;
	}

	onAnimationFinished(type:string,data:cc.AnimationState){
		switch(type){
			case this.m_actVec["Attack"]:
			case this.m_actVec["Hurt"]:
				this.onIdle();
				break;
			case this.m_actVec["Dead"]:
				this.destroy();
				break;
			default:
				break;
		}
	}

	onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider):void{
		if(!this.m_isAttack)
			return;
		let event:dF.CUSDefine.AttEvent = {
			attNode:this.node,
			hitNode:null,
			damage:this.getDamage(),
			hitback:cc.vec2(0,0),
			hitLev:this.m_hitLevel
		};

		let target:cc.Node = other.node.parent.getChildByName("body");
		target.getComponent("Character").onHurt(event);
	}

	onCollisionStay(other:cc.BoxCollider, self:cc.BoxCollider):void{
		
	}

	onCollisionExit(other:cc.BoxCollider, self:cc.BoxCollider):void{
		
	}
};