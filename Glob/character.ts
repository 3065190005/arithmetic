// 人物类

const {ccclass, property} = cc._decorator;

import dF = require("./TypeDefine"); 
import gM = require("./GameManager");
import GameWorld from './GameWorld';
import PhyBoxTarget from './PhyBoxTarget';

@ccclass
export default class Character extends cc.Component {

	@property({displayName:"调试-位置信息",type:cc.Boolean})
	private md_nodePosDebug:boolean = true;

	@property({displayName:"调试-物理起始结束",type:cc.Boolean})
	private md_phyPosDebug:boolean = true;

	// 单体初始化（可重写
	initChar():void{
		this.m_chartype = dF.CUSDefine.CharacterType.Enemy;
		let Game:GameWorld = cc.find("Canvas/Game").getComponent("GameWorld");
		Game?.EnemyVec.push(this.node);
	}

	// 单体销毁（可重写
	uniniChar():void{
		let Game:GameWorld = cc.find("Canvas/Game").getComponent("GameWorld");
		let index:number = 0;
		for(let i in Game.EnemyVec){
			if(Game.EnemyVec[i] == this.node){
				Game.EnemyVec.splice(index,1);
				return;
			}
			index ++;
		}
	}

	// 初始变量通用全局
	onLoad():void {

		this.m_actVec = new Map();
		this.m_Inputkey = new Map();

		this.m_isJumped = 0;
		this.m_isAttack = false;
		this.m_canBeHurt = true;

		this.m_direction = cc.v2(0,0);

		this.m_animeB = "null";
		this.m_animeA = "Idle";
		this.m_playAnime = "null";

		this.m_actVec.set("Idle","Idle");
		this.m_actVec.set("Move","Move");
		this.m_actVec.set("Attack","Attack");
		this.m_actVec.set("Hurt","Hurt");
		this.m_actVec.set("Dead","Dead");

		this.m_actVec.set("JumpUp","Move");
		this.m_actVec.set("JumpSt","Move");
		this.m_actVec.set("JumpDn","Move");

		this.m_Inputkey[cc.macro.KEY.a] = 0;
		this.m_Inputkey[cc.macro.KEY.d] = 0;
		this.m_Inputkey[cc.macro.KEY.w] = 0;
		this.m_Inputkey[cc.macro.KEY.j] = 0;
		this.m_Inputkey[cc.macro.KEY.e] = 0;

		let hitBox:cc.Node = this.node.parent.getChildByName("hitBox");
		let attBox:cc.Node = this.node.parent.getChildByName("attBox");

		this.m_hitBox = hitBox.getComponents(cc.BoxCollider);
		this.m_attBox = attBox.getComponents(cc.BoxCollider);

		this.m_rigidBody = this.node.parent.getComponent(cc.RigidBody);
		this.m_phyBox = this.node.parent.getComponents(cc.PhysicsBoxCollider);
		this.m_animation = this.node.getComponent(cc.Animation);

		this.m_status = dF.CUSDefine.State.None;
		this.m_chartype = dF.CUSDefine.CharacterType.None;

		this.m_animation.on("finished",this.onAnimationFinished,this);
	}

	// 初始化状态通用全局
	start():void{
		this.initChar();
		this.onIdle(true);

		
	}

	// 帧更新
	update(dt:number):void{
		this.KeyPress();
		let stat:dF.CUSDefine.State;
		stat = this.StateTree();
		this.UpdateMotion(stat);

		this.AirUpdate(8);

		if(this.md_nodePosDebug){
			console.info(`PosX:${this.node.parent.position.x} , PosY:${this.node.parent.position.y}`);
		}
	}

	// 跳跃更新 0不跳跃,1上升,2中间停留,3下落,4末尾
	AirUpdate(stop:number):void{
		let target :number = this.m_rigidBody.linearVelocity.y;
		if(this.m_isJumped != 0){
			if(target > stop && this.m_isJumped != 4){
				if(this.m_isJumped == 3){
					this.m_isJumped = 4;
				}else{
					this.m_isJumped = 1;
				}
			}
			else if(target < -stop && this.m_isJumped != 4){
				this.m_isJumped = 3;
			}
			else if(Math.abs(target) <= stop && this.m_isJumped != 4){
				this.m_isJumped = 2;	
			}
			else if(target == 0 && this.m_isJumped == 4){
				this.m_isJumped = 0;
			}
		}else if(this.m_isJumped == 0 && target < -stop){
			this.m_isJumped = 3;
			this.onIdle();
		}
	}

	// 销毁通用
	onDestroy():void{
		this.m_animation.off("finished",this.onAnimationFinished,this);
		this.uniniChar();

		this.node.parent.destroy();
	}

	@property({displayName:"基础血量"})
	m_baseHeaNum:number = 5;		// 基础血量
	m_effsetHeaNum:number = 0;		// 额外血量
	m_offsetHeaNum:number = 1;		// 每级增值率
	m_heaNum:number = 5;			// 当前血量

	@property({displayName:"基础攻击力"})
	m_baseAttNum:number = 1;
	m_effsetAttNum:number = 0;
	m_offsetAttNum:number = 1;

	@property({displayName:"基础速度"})
	m_baseSepNum:number = 30;
	m_offsetSepNum:number = 1;

	@property({displayName:"基础跳跃高度"})
	m_baseJumpHeight:number = 170;
	m_offsetJumpHeight:number = 0.1;

	@property({displayName:"角色等级"})
	m_Level:number = 1;

	// 位置方向
	m_direction:cc.Vec2;

	// 是否按下攻击
	m_isAttack:boolean;

	// 跳跃状态 0不跳 1 起跳 2中间 3 结尾
	m_isJumped:number;

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

	// 当前动画状态
	m_animaState:cc.AnimationState;

	// 碰撞体组件
	m_hitBox:cc.BoxCollider[];
	m_attBox:cc.BoxCollider[];

	// 物理组件
	m_phyBox:cc.PhysicsBoxCollider[];

	// 行为动作
	m_actVec:Map<string,string>;

	// 输入按键
	m_Inputkey:Map<cc.macro.KEY,number>;

	// 人物类型
	m_chartype:dF.CUSDefine.CharacterType;

	// 物理引擎Scale防止
	m_RealTarget:number = 0;

	// 总伤害 = 额外伤害 + (基础伤害+(等级*增值率))
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
		
		if(this.m_status == dF.CUSDefine.State.Hurt || this.m_status == dF.CUSDefine.State.Dead){
			return dF.CUSDefine.State.None
		}

		if(this.m_isAttack){
			stat = dF.CUSDefine.State.Attack;
		}else if(!this.m_direction.equals(cc.v2(0,0))){
			stat = dF.CUSDefine.State.Move;
		}else{
			stat = dF.CUSDefine.State.Idle;
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
		let moveR:number = this.m_Inputkey[cc.macro.KEY.d];
		let moveL:number = this.m_Inputkey[cc.macro.KEY.a];
		let moveU:number = this.m_Inputkey[cc.macro.KEY.w];
		let att:number = this.m_Inputkey[cc.macro.KEY.j];

		this.m_direction = cc.v2(0,0);
		if(moveR){this.m_direction.x++;}
		if(moveL){this.m_direction.x--;}
		if(moveU){this.m_direction.y = moveU;}

		if(att){this.m_isAttack = true;}
		else {this.m_isAttack = false;}
	}

	// 站立
	public onIdle(change:boolean = false):boolean{
		let action:string = this.m_actVec.get("Idle");
		
		if(change == false){
			if(this.m_status > dF.CUSDefine.State.Move){
				return false;
			}
			if(this.m_status == dF.CUSDefine.State.None){
				return false;
			}
		}

		if(this.m_isJumped != 0){
			return this.onJump();
		}

		this.onChangeStatus(action,change);
		return true;
	}

	// 移动
	public onMove(change:boolean = false):boolean{
		let action:string = this.m_actVec.get("Move");
		let speed = this.getSpeed() * this.m_direction.x;
		let isjump:boolean = this.m_direction.y == 1 ? true:false;
		let linear:cc.Vec2 = new cc.Vec2();
		

		if(change == false){
			if(this.m_status > dF.CUSDefine.State.Move){
				return false;
			}

			if(this.m_status == dF.CUSDefine.State.None){
				return false;
			}
		}

		linear = this.m_rigidBody.linearVelocity;

		if(this.m_isJumped == 0){
			if(isjump){
				linear.y = this.getJumpHeight();
				this.m_isJumped = 1;
			}
			linear.x = speed;
		}

		this.m_rigidBody.linearVelocity = linear;

		if(this.m_isJumped != 0){
			return this.onJump();
		}

		let beforScaleX:number = this.node.parent.scaleX;
		let afterScaleX:number = this.m_direction.x * Math.abs(this.node.parent.scaleX);

		if(beforScaleX != afterScaleX){
			this.node.parent.scaleX = this.m_direction.x * Math.abs(this.node.parent.scaleX);
		}

		this.onChangeStatus(action,change);
		return true;
	}

	// 跳远（移动附属
	public onJump(change:boolean = false):boolean{
		let action:string;
		switch (this.m_isJumped){
			case 1: action = this.m_actVec.get("JumpUp");
			break;
			case 2: action = this.m_actVec.get("JumpSt");
			break;
			case 4:
			case 3: action = this.m_actVec.get("JumpDn");
			break;
			default:
			break;
		}

		this.onChangeStatus(action,change);
		return true;
	}

	// 攻击
	public onAttack(change:boolean = false):boolean{
		let action:string = this.m_actVec.get("Attack");
		if(change == false){
			if(this.m_status >= dF.CUSDefine.State.Attack){
				return false;
			}

			if(this.m_status == dF.CUSDefine.State.None){
				return false;
			}
		}


		this.m_isAttack = true;
		this.onChangeStatus(action,change);
		return true;
	}	

	// 受伤
	public onHurt(event:dF.CUSDefine.AttEvent,change:boolean = false):boolean{
		let action:string = this.m_actVec.get("Hurt");
		if(change == false){
			if(this.m_canBeHurt == false){
				return false;
			}

			if(this.m_status > dF.CUSDefine.State.Hurt){
				return false;
			}
		}

		event.hitNode = this.node;
		let GameInstn:gM.Global.GameRule = gM.Global.GameRule.getInstance();
		this.m_heaNum -= event.damage;

		if(this.getHeath() <= 0){
			return this.onDead();
		}

		this.onChangeStatus(action,change);
		return true;
	}

	// 死亡
	public onDead(change:boolean = false):boolean{
		let action:string = this.m_actVec.get("Dead");
		this.m_canBeHurt = false;

		this.onChangeStatus(action,change);
		return true;
	}

	// 玩家状态改变
	private onChangeStatus(action:string,change:Boolean):boolean{
		if(action == "null"){
			return false;
		}

		if(this.m_animeA == action && change == false){
			return false;
		}

		this.m_animeB = this.m_animeA;
		this.m_animeA = action;
		this.m_status = dF.CUSDefine.StatusVec.get(this.m_animeA);

		if(this.m_playAnime != this.m_animeA){
			this.m_playAnime = this.m_animeA;
			this.m_animaState = this.m_animation.play(this.m_playAnime);
			this.m_animaState.speed(1);
		}
		
		return true;
	}

	// 打击感
	public hitSTEvent():boolean{
		
	}


	// 物理框帧事件
	public onPhyBoxAniCallBack(id:number,x:number,y:number,w:number,h:number):void{
		if(id == -1){
			this.m_phyBox.forEach((box:cc.PhysicsBoxCollider)=>{
				let boffset:cc.Vec2 = cc.v2(x,y);
				let bsize:cc.Size = cc.size(w,h);

				box.offset = boffset;
				box.size = bsize;

				box.apply();
			});
			return;
		}

		let boffset:cc.Vec2 = cc.v2(x,y);
		let bsize:cc.Size = cc.size(w,h);

		this.m_phyBox[id].offset = boffset;
		this.m_phyBox[id].size = bsize;

		this.m_phyBox[id].apply();
	}

	// 攻击框帧事件
	public onAttBoxAniCallBack(id:number,x:number,y:number,w:number,h:number):void{
		if(id == -1){
			this.m_attBox.forEach((box:cc.BoxCollider)=>{
				let boffset:cc.Vec2 = cc.v2(x,y);
				let bsize:cc.Size = cc.size(w,h);
				box.offset = boffset;
				box.size = bsize;
			});
			return;
		}

		let boffset:cc.Vec2 = cc.v2(x,y);
		let bsize:cc.Size = cc.size(w,h);
		this.m_attBox[id].offset = boffset;
		this.m_attBox[id].size = bsize;
	}

	// 受击框帧事件
	public onColiBoxAniCallBack(id:number,x:number,y:number,w:number,h:number):void{
		if(id == -1){
			this.m_hitBox.forEach((box:cc.BoxCollider)=>{
				let boffset:cc.Vec2 = cc.v2(x,y);
				let bsize:cc.Size = cc.size(w,h);
				box.offset = boffset;
				box.size = bsize;
			});
			return;
		}

		let boffset:cc.Vec2 = cc.v2(x,y);
		let bsize:cc.Size = cc.size(w,h);
		this.m_hitBox[id].offset = boffset;
		this.m_hitBox[id].size = bsize;
	}

	// 动画结束回调
	onAnimationFinished(type:string,data:cc.AnimationState){
		switch(this.m_playAnime){
			case this.m_actVec.get("Attack"):
				this.m_isAttack = false;
			case this.m_actVec.get("Hurt"):
				this.m_status = dF.CUSDefine.State.Idle;
				this.onIdle();
				break;
			case this.m_actVec.get("Dead"):
				this.destroy();
				break;
			default:
				break;
		}
	}

	// 碰撞组件3函数
	onCollisionEnter(other:cc.BoxCollider, self:cc.BoxCollider):void{
		// 0 - 9 受击 | 10 - x 攻击
		if(self.tag > 9 || other.tag <= 9){
			if(!this.m_isAttack)
				return;

			let event:dF.CUSDefine.AttEvent = {
				attNode:this.node,
				hitNode:null,
				damage:this.getDamage(),
				hitback:cc.v2(0,0),
				hitLev:this.m_hitLevel
			};

			let ishurt:boolean;
			let target:cc.Node = other.node.parent.getChildByName("body");
			ishurt = target.getComponent((<PhyBoxTarget>target.parent.getComponent("PhyBoxTarget")).ComName).onHurt(event);
			if(ishurt){
				let GR = gM.Global.GameRule.getInstance();
				GR.nodeSTCallBack(event);
			}
		}
	}

	onCollisionStay(other:cc.BoxCollider, self:cc.BoxCollider):void{
		
	}

	onCollisionExit(other:cc.BoxCollider, self:cc.BoxCollider):void{
		
	}

	// 物理4组件 1 = 身体 2 = 跳跃检测
	onBeginContact(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherConllider:cc.PhysicsCollider):void{
		
		//只在两个碰撞体开始接触时调用一次
    }

	onPreSolve(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherConllider:cc.PhysicsCollider):void{
        //每次将要处理碰撞体接触逻辑时被调用
    }

	onPostSolve(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherConllider:cc.PhysicsCollider):void{
        //每次处理完碰撞体接触逻辑时被调用
    }

	onEndContact(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherConllider:cc.PhysicsCollider):void{

	}
};