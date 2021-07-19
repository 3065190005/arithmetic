const {ccclass, property} = cc._decorator;

@ccclass
export class Character extends cc.Component {
	
	onLoad():void{
		this.m_animeB = "null";
		this.m_animeA = "Idle";
		
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

	m_animeA:string;
	m_animeB:string;

	public onIdle(){

	}

	public onMove(){

	}

	public onJump(){

	}

	public onAttack(){

	}	

	public onHurt(){

	}

	public onDead(){

	}

	private onChangeStatus(){

	}

	public AttBoxUpdate(id:number,x:number,y:number,w:number,h:number){

	}

	public ClyBoxUpdate(id:number,x:number,y:number,w:number,h:number){
		
	}
};