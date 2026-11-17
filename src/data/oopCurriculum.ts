import {
  AnatomyPart,
  ClassBlueprint,
  LearningStage,
  QuizQuestion,
} from '../types/oop';

export const LEARNING_STAGES: LearningStage[] = [
  {
    id: 'init',
    order: '階段 1',
    title: '定義類別與建立物件',
    summary: '使用 class 建立設計藍圖，並透過 __init__ 建構子初始化每個獨立物件的初始資料。',
    keyInsight:
      '呼叫 Drone("Sky-01", 85) 時，Python 會先在記憶體配置新空間，再自動執行 __init__(self, ...)，將資料寫入該物件專屬的屬性中。',
  },
  {
    id: 'attributes',
    order: '階段 2',
    title: '類別屬性與實例屬性',
    summary: '區分「所有物件共享的類別屬性」與「每個物件各自獨立的實例屬性」。',
    keyInsight:
      '修改類別屬性（例如 Drone.max_altitude）會影響所有未覆寫該屬性的物件；修改 self.battery 則只會改變單一物件的狀態。',
  },
  {
    id: 'methods',
    order: '階段 3',
    title: '方法呼叫與 self 綁定',
    summary: '觀察當你呼叫 d1.fly(20) 時，Python 如何自動將 d1 傳入方法的第一個參數 self。',
    keyInsight:
      '方法寫在類別藍圖裡只有一份，但執行 d1.fly(20) 等同於 Drone.fly(d1, 20)。self 永遠指向「正在呼叫這個方法的物件本人」。',
  },
  {
    id: 'encapsulation',
    order: '階段 4',
    title: '封裝與 @property 保護',
    summary: '透過雙底線私有屬性 __serial 與 @property 驗證器，避免外部程式碼填入不合理的數值。',
    keyInsight:
      '直接寫 d1.__secret 會觸發 AttributeError（名稱修飾保護）；透過公開方法或 @property setter 可以安全地檢查數值邊界。',
  },
];

export const CLASS_BLUEPRINTS: Record<'drone' | 'bank' | 'hero', ClassBlueprint> = {
  drone: {
    id: 'drone',
    className: 'Drone',
    displayName: '無人機 Drone',
    varPrefix: 'd',
    classAttrName: 'max_altitude',
    classAttrDefault: 120,
    classAttrUnit: 'm',
    classAttrDesc: '所有無人機共同遵守的法定限高（類別屬性）',
    privateAttrName: '__flight_hours',
    privateAttrLabel: '內部飛行時數（私有）',
    gaugeKey: 'battery',
    gaugeLabel: '剩餘電量',
    gaugeMax: 100,
    gaugeUnit: '%',
    constructorParams: [
      {
        key: 'name',
        label: '機體代號 (name)',
        type: 'text',
        defaultValue: 'Scout-Alpha',
        placeholder: '例如 Sky-01',
      },
      {
        key: 'battery',
        label: '初始電量 (battery)',
        type: 'number',
        defaultValue: 85,
        min: 20,
        max: 100,
        step: 5,
        unit: '%',
      },
      {
        key: 'altitude',
        label: '起始高度 (altitude)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 100,
        step: 10,
        unit: 'm',
      },
    ],
    methods: [
      {
        id: 'fly',
        name: 'fly',
        signature: 'def fly(self, meters):',
        description: '爬升指定高度並消耗電量（若超出限高會自動攔截）',
        paramLabel: '爬升高度 (meters)',
        paramKey: 'meters',
        paramMin: 10,
        paramMax: 60,
        paramStep: 10,
        paramDefault: 20,
        paramUnit: 'm',
      },
      {
        id: 'charge',
        name: 'charge',
        signature: 'def charge(self):',
        description: '降落至地面並將該實例電量補充至 100%',
      },
    ],
  },
  bank: {
    id: 'bank',
    className: 'BankAccount',
    displayName: '銀行帳戶 BankAccount',
    varPrefix: 'acc',
    classAttrName: 'interest_rate',
    classAttrDefault: 2.5,
    classAttrUnit: '%',
    classAttrDesc: '全行統一公告年利率（類別屬性）',
    privateAttrName: '__pin_attempts',
    privateAttrLabel: '密碼錯誤次數（私有）',
    gaugeKey: 'balance',
    gaugeLabel: '帳戶餘額',
    gaugeMax: 10000,
    gaugeUnit: '元',
    constructorParams: [
      {
        key: 'owner',
        label: '戶名 (owner)',
        type: 'text',
        defaultValue: '王小明',
        placeholder: '輸入開戶人姓名',
      },
      {
        key: 'balance',
        label: '開戶金額 (balance)',
        type: 'number',
        defaultValue: 3000,
        min: 500,
        max: 9000,
        step: 500,
        unit: '元',
      },
      {
        key: 'tier',
        label: '帳戶等級 (tier)',
        type: 'select',
        defaultValue: '一般帳戶',
        options: ['一般帳戶', '薪轉帳戶', '尊榮理財'],
      },
    ],
    methods: [
      {
        id: 'deposit',
        name: 'deposit',
        signature: 'def deposit(self, amount):',
        description: '存入指定金額並更新該帳戶的餘額屬性',
        paramLabel: '存款金額 (amount)',
        paramKey: 'amount',
        paramMin: 500,
        paramMax: 3000,
        paramStep: 500,
        paramDefault: 1000,
        paramUnit: '元',
      },
      {
        id: 'withdraw',
        name: 'withdraw',
        signature: 'def withdraw(self, amount):',
        description: '提領金額（封裝邏輯會檢查餘額是否足夠）',
        paramLabel: '提款金額 (amount)',
        paramKey: 'amount',
        paramMin: 500,
        paramMax: 3000,
        paramStep: 500,
        paramDefault: 1000,
        paramUnit: '元',
      },
    ],
  },
  hero: {
    id: 'hero',
    className: 'Hero',
    displayName: '冒險者 Hero',
    varPrefix: 'h',
    classAttrName: 'world_level',
    classAttrDefault: 1,
    classAttrUnit: '級',
    classAttrDesc: '伺服器全域世界等級（類別屬性）',
    privateAttrName: '__hidden_crit',
    privateAttrLabel: '隱藏暴擊權重（私有）',
    gaugeKey: 'hp',
    gaugeLabel: '生命值 HP',
    gaugeMax: 150,
    gaugeUnit: 'HP',
    constructorParams: [
      {
        key: 'name',
        label: '角色名稱 (name)',
        type: 'text',
        defaultValue: '艾琳',
        placeholder: '輸入角色名稱',
      },
      {
        key: 'hp',
        label: '初始生命 (hp)',
        type: 'number',
        defaultValue: 100,
        min: 50,
        max: 150,
        step: 10,
        unit: 'HP',
      },
      {
        key: 'job',
        label: '職業定位 (job)',
        type: 'select',
        defaultValue: '劍士',
        options: ['劍士', '法師', '遊俠'],
      },
    ],
    methods: [
      {
        id: 'train',
        name: 'train',
        signature: 'def train(self, hours):',
        description: '進行特訓提升等級並消耗些許體力',
        paramLabel: '訓練時數 (hours)',
        paramKey: 'hours',
        paramMin: 1,
        paramMax: 5,
        paramStep: 1,
        paramDefault: 2,
        paramUnit: '小時',
      },
      {
        id: 'heal',
        name: 'heal',
        signature: 'def heal(self):',
        description: '使用回復藥水恢復生命值至上限 150 HP',
      },
    ],
  },
};

export const ANATOMY_PARTS: AnatomyPart[] = [
  {
    id: 'class-kw',
    token: 'class Student:',
    lineNumber: 1,
    title: 'class 關鍵字與類別名稱',
    role: '藍圖宣告',
    explanation:
      '使用 class 關鍵字定義新類別，依 Python PEP 8 規範採用大駝峰命名（PascalCase），代表一種資料結構與行為的設計藍圖。',
  },
  {
    id: 'class-attr',
    token: 'school = "Python Academy"',
    lineNumber: 2,
    title: '類別屬性（Class Attribute）',
    role: '全體共享',
    explanation:
      '直接定義在 class 區塊內的變數，由這個類別建立的所有物件共用同一份資料，適合存放常數或統一設定。',
  },
  {
    id: 'init-method',
    token: 'def __init__(self, name, score):',
    lineNumber: 4,
    title: '__init__ 建構子（Initializer）',
    role: '實例化入口',
    explanation:
      '雙底線開頭與結尾的特殊方法（Dunder Method）。每次呼叫 Student("小華", 90) 建立物件時，Python 會自動執行它來設定初始狀態。',
  },
  {
    id: 'self-param',
    token: 'self.name = name',
    lineNumber: 5,
    title: 'self 指標與實例屬性',
    role: '指向物件本人',
    explanation:
      'self 代表「當下正在建立或操作的那個物件實例」。self.name 將參數值綁定到該物件自己的記憶體空間，不會與其他物件混淆。',
  },
  {
    id: 'instance-method',
    token: 'def add_bonus(self, pts):',
    lineNumber: 8,
    title: '實例方法（Instance Method）',
    role: '物件行為',
    explanation:
      '定義物件能執行的動作。第一個參數必須是 self，讓方法內部能讀取或修改該物件自身的屬性（如 self.score += pts）。',
  },
  {
    id: 'instantiation',
    token: 's1 = Student("小華", 88)',
    lineNumber: 12,
    title: '實例化（Instantiation）',
    role: '誕生實體物件',
    explanation:
      '像呼叫函式一樣呼叫類別名稱，就會依照藍圖產出一個真正存在於記憶體中的物件，並交給變數 s1 參照。',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: '實例化與 self',
    prompt: '執行下方程式碼後，畫面會印出什麼結果？',
    code: `class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return f"{self.name}：汪！"

d1 = Dog("小白")
d2 = Dog("黑輪")
print(d2.bark())`,
    options: ['小白：汪！', '黑輪：汪！', 'self：汪！', '發生 TypeError 錯誤'],
    correctIndex: 1,
    explanation:
      'd1 與 d2 是兩個獨立的物件實例。呼叫 d2.bark() 時，Python 會自動將 d2 傳入 self，因此 self.name 讀取的是 d2 的 "黑輪"。',
  },
  {
    id: 'q2',
    topic: '類別屬性 vs 實例屬性',
    prompt: '關於類別屬性 tax_rate 的修改，下列程式碼的輸出為何？',
    code: `class Item:
    tax_rate = 0.05

a = Item()
b = Item()
Item.tax_rate = 0.10
a.tax_rate = 0.08
print(a.tax_rate, b.tax_rate)`,
    options: ['0.05 0.05', '0.10 0.10', '0.08 0.10', '0.08 0.05'],
    correctIndex: 2,
    explanation:
      'Item.tax_rate = 0.10 修改了類別屬性，所以 b 會讀到 0.10；但 a.tax_rate = 0.08 是在物件 a 自己身上新建了一個同名的實例屬性，會遮蔽類別屬性。',
  },
  {
    id: 'q3',
    topic: '漏寫 self 參數',
    prompt: '執行下面這段程式時，Python 會發生什麼情況？',
    code: `class Counter:
    def __init__(self):
        self.count = 0

    def step():
        print("Step!")

c = Counter()
c.step()`,
    options: [
      '正常印出 Step!',
      '印出 0',
      '發生 TypeError: step() takes 0 positional arguments but 1 was given',
      '發生 AttributeError',
    ],
    correctIndex: 2,
    explanation:
      '因為 c.step() 呼叫時 Python 會自動偷偷把物件 c 當作第一個引數傳進去，但 def step(): 沒有宣告接收 self 參數，所以會報 TypeError。',
  },
  {
    id: 'q4',
    topic: '繼承與 super()',
    prompt: '子類別 ElectricCar 繼承自 Car，執行後輸出為何？',
    code: `class Car:
    def __init__(self, brand):
        self.brand = brand

class ElectricCar(Car):
    def __init__(self, brand, kwh):
        super().__init__(brand)
        self.kwh = kwh

ev = ElectricCar("Model Y", 75)
print(ev.brand, ev.kwh)`,
    options: [
      'Model Y 75',
      'Car 75',
      '發生 AttributeError: ElectricCar object has no attribute brand',
      'None 75',
    ],
    correctIndex: 0,
    explanation:
      'super().__init__(brand) 會呼叫父類別 Car 的建構子，協助將 self.brand 設定為 "Model Y"，接著再設定子類別獨有的 self.kwh = 75。',
  },
  {
    id: 'q5',
    topic: '物件識別 (is vs ==)',
    prompt: '建立兩個相同參數的物件 p1 與 p2，下列敘述何者正確？',
    code: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p1 = Point(3, 4)
p2 = Point(3, 4)
print(p1 is p2, type(p1) is type(p2))`,
    options: ['True True', 'False True', 'True False', 'False False'],
    correctIndex: 1,
    explanation:
      '每次呼叫 Point(3, 4) 都會在記憶體配置一個全新的物件實例，因此 p1 與 p2 的記憶體位址不同（p1 is p2 為 False），但兩者皆由同一張 Point 藍圖打造（type 相同，為 True）。',
  },
];
