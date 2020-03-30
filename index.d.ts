/* eslint-disable @typescript-eslint/no-empty-interface */
export {};

// Utility Types

interface ConstructorOf<C> {
	new(...args: any[]): C;
}

// Id Types

export interface Id {
	bytes: Uint8Array;
	[Symbol.toStringTag]: string;

	clone(): this;

	toCanonical(): string;
	toRaw(): string;

	compare(rhs: Id): number;
	equal(rhs: Id): boolean;
}

export interface Uuid extends Id {
	variant: number;
	version: number;
}

export interface Ulid extends Id {
	time: Date;
}

export interface UlidMonotonic extends Id {
	time: Date;
}

export interface Uuid1 extends Uuid {
	clock_sequence: number;
	hires_time: number;
	node: Uint8Array;
	time: Date;
}

export interface Uuid4 extends Uuid {}

export interface Uuid6 extends Uuid {
	clock_sequence: number;
	hires_time: number;
	node: Uint8Array;
	time: Date;
}

export interface UuidNil extends Uuid {}

// Id Factories

interface IdFactory<T> {
	name: string;
	type: ConstructorOf<T>;

	construct(bytes: Uint8Array): T;
	generate(options?: {}): T;
	MIN(options?: {}): T;
	MAX(options?: {}): T;

	fromCanonical(canonical: string): T;
	fromCanonicalTrusted(canonical: string): T;
	fromRaw(raw: string): T;
	fromRawTrusted(raw: string): T;

	toCanonical(id: T): string;
	toRaw(id: T): string;

	compare(lhs: Id, rhs: Id): number;
	equal(lhs: Id, rhs: Id): boolean;

	isCanonical(canonical: string): boolean;
	isRaw(raw: string): boolean;
}

interface VersionedIdFactory<T> extends IdFactory<T> {
	versioned_ids: Array<IdFactory<T>>;

	MIN(options: VersionOption): T;
	MAX(options: VersionOption): T;
}

interface NodeOption {
	node?: Uint8Array | null;
}

interface TimeOption {
	time?: Date | number | null;
}

interface VersionOption {
	version: number;
}

export type AnyIdFactory = IdFactory<Id>;

export interface UlidFactory extends IdFactory<Ulid> {
	generate(options?: TimeOption): Ulid;
}

export interface UlidMonotonicFactory extends IdFactory<UlidMonotonic> {
	generate(options?: TimeOption): UlidMonotonic;
}

export interface UuidFactory extends VersionedIdFactory<Uuid> {
	generate(options: NodeOption & TimeOption & VersionOption): Uuid;
}

export interface Uuid1Factory extends IdFactory<Uuid1> {
	generate(options?: NodeOption & TimeOption): Uuid1;
}

export interface Uuid4Factory extends IdFactory<Uuid4> {
	generate(options?: {}): Uuid4;
}

export interface Uuid6Factory extends IdFactory<Uuid6> {
	generate(options?: NodeOption & TimeOption): Uuid6;
}

export interface UuidNilFactory extends IdFactory<UuidNil> {
	generate(options?: {}): UuidNil;
}

// Errors

// NOTE: Actually extends Error, but typescript breaks instanceof support
export interface Id128Error extends Function {
	readonly name: string;
	message: string;
	stack?: string;
}
export interface ClockSequenceOverflow extends Id128Error {}
export interface InvalidBytes extends Id128Error {}
export interface InvalidEncoding extends Id128Error {}
export interface InvalidEpoch extends Id128Error {}
export interface UnsupportedVersion extends Id128Error {}

// Exported Functions

export function idCompare(lhs: Id, rhs: Id): number;
export function idEqual(lhs: Id, rhs: Id): boolean;

// Exported Constants

export const Ulid: UlidFactory;
export const UlidMonotonic: UlidMonotonicFactory;
export const Uuid: UuidFactory;
export const Uuid1: Uuid1Factory;
export const Uuid4: Uuid4Factory;
export const Uuid6: Uuid6Factory;
export const UuidNil: UuidNilFactory;

export namespace Exception {
	const Id128Error: ConstructorOf<Id128Error>;
	const ClockSequenceOverflow: ConstructorOf<ClockSequenceOverflow>;
	const InvalidBytes: ConstructorOf<InvalidBytes>;
	const InvalidEncoding: ConstructorOf<InvalidEncoding>;
	const InvalidEpoch: ConstructorOf<InvalidEpoch>;
	const UnsupportedVersion: ConstructorOf<UnsupportedVersion>;
}
