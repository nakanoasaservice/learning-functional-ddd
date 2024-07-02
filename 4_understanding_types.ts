// 4.1
type SquarePlusOne = (x: number) => number;

const squarePlusOne: SquarePlusOne = x => {
  const square = x * x;
  return square + 1;
};

const areEqual = <T>(x: T, y: T): boolean => x === y;

// 4.2

// 4.3
type AppleVariety = 'GoldenDelicious' | 'GrannySmith' | 'Fuji';
type BananaVariety = 'Cavendish' | 'GrosMichel' | 'Manzano';
type CherryVariety = 'Montmorency' | 'Bing';

type FruitSalad = {
  apple: AppleVariety;
  banana: BananaVariety;
  cherry: CherryVariety;
};

type FruitSnack = AppleVariety | BananaVariety | CherryVariety;

// 単純型を定義するためのユーティリティ関数
type Brand<T, U> = T & { __brand: U };

type ProductCode = Brand<string, 'ProductCode'>;

// 4.4
type Person = {
  first: string;
  last: string;
};

const aPerson = { first: 'Jane', last: 'Doe' };

const { first, last } = aPerson;
// const first = aPerson.first;
// const last = aPerson.last;

// この方法だと実行時に判別できない
// type UnitQuantity = Brand<number, "UnitQuantity">;
// type KilogramQuantity = Brand<number, "KilogramQuantity">;
// type OrderQuantity = UnitQuantity | KilogramQuantity;

// const anOrderQtyInUnits: OrderQuantity = 1 as UnitQuantity;

// const anOrderQtyInWeight: OrderQuantity = 2.3 as KilogramQuantity;

// このようにすることで実行時に判別できる
type UnitQuantity = { type: 'UnitQuantity'; value: number };
type KilogramQuantity = { type: 'KilogramQuantity'; value: number };
type OrderQuantity = UnitQuantity | KilogramQuantity;

const anOrderQtyInUnits = { type: 'UnitQuantity', value: 1 } as UnitQuantity;
const anOrderQtyInKg = {
  type: 'KilogramQuantity',
  value: 2.5,
} as KilogramQuantity;

const printQuantity = (aOrderQty: OrderQuantity) => {
  switch (aOrderQty.type) {
    case 'UnitQuantity':
      console.log(`${aOrderQty.value} units`);
      break;
    case 'KilogramQuantity':
      console.log(`${aOrderQty.value} kg`);
      break;
  }
};

printQuantity(anOrderQtyInUnits); // 1 units
printQuantity(anOrderQtyInKg); // 2.5 kg

// 4.5 型の合成によるドメインモデルの構築

type CheckNumber = Brand<number, 'CheckNumber'>;
type CardNumber = Brand<string, 'CardNumber'>;

type CardType = 'Visa' | 'MasterCard';

type CreditCardInfo = {
  cardType: CardType;
  cardNumber: CardNumber;
};

type PaymentMethod =
  | {
      type: 'Cash';
    }
  | {
      type: 'Check';
      checkNumber: CheckNumber;
    }
  | {
      type: 'CreditCardInfo';
      info: CreditCardInfo;
    };

type PaymentAmount = Brand<number, 'PaymentAmount'>;
type Currency = 'EUR' | 'USD';

type Payment = {
  amount: PaymentAmount;
  currency: Currency;
  method: PaymentMethod;
};

type UnpaidInvoice = 'Unimplemented UnpaidInvoice';
type PaidInvoice = 'Unimplemented PaidInvoice';

// 請求書の支払い（未払い請求書を支払い済み請求書に変換する）
// type PayInvoice = (x: UnpaidInvoice) => (y: Payment) => PaidInvoice;

// 外貨両替（ある通貨での支払いを別の通貨での支払いに変換する）
type ConvertCurrency = (x: Payment) => (y: Currency) => Payment;

// 4.6

type Option<T> =
  | {
      type: 'Some';
      value: T;
    }
  | {
      type: 'None';
    };

// type PersonalName = {
//   firstName: string;
//   middleInitial: Option<string>;
//   lastName: string;
// }

// 代わりにundefinedを使う
type PersonalName = {
  firstName: string;
  middleInitial?: string;
  lastName: string;
};

type Result<S, F> =
  | {
      type: 'Success';
      value: S;
    }
  | {
      type: 'Failure';
      error: F;
    };

type PaymentError =
  | 'CardTypeNotRecognized'
  | 'PaymentRejected'
  | 'PaymentProvidersOffline';
type PayInvoice = (
  x: UnpaidInvoice
) => (y: Payment) => Result<PaidInvoice, PaymentError>;

type Customer = 'Unimplemented Customer';
type SaveCustomer = (c: Customer) => void;

type NextRandom = () => number;

type OrderId = Brand<string, 'OrderId'>;
type OrderLine = 'Unimplemented OrderLine';
type Order = {
  orderId: OrderId;
  lines: OrderLine[];
};

const aList = [1, 2, 3];

const aNewList = [0, ...aList];

import { match, P } from 'ts-pattern';

const printList1 = (list: number[]) => {
  match(list)
    .with([], () => console.log('list is empty'))
    .with([P.select()], x => console.log(`list has one element: ${x}`))
    .with([P.select('x'), P.select('y')], ({ x, y }) =>
      console.log(`list has two elements: ${x} and ${y}`)
    )
    .otherwise(() => console.log('list has more than two elements'));
};

const printList2 = (aList: number[]) => {
  match(aList)
    .with([], () => console.log('list is empty'))
    .with([P.select(), ...P.array()], first => {
      console.log(`list is non-empty with the first element being: ${first}`);
    });
};
