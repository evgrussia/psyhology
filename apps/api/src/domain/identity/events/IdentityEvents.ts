import { DomainEvent } from '../../shared/events/DomainEvent';
import { UserId } from '../value-objects/Ids';
import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';
import { ConsentType } from '../value-objects/ConsentType';
import { Role } from '../value-objects/Role';

/**
 * UserCreatedEvent
 */
export class UserCreatedEvent extends DomainEvent {
  constructor(
    readonly userId: UserId,
    readonly email: Email | null,
    readonly phone: PhoneNumber | null,
    readonly telegramUserId: string | null,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.userId.value;
  }

  get eventName(): string {
    return 'UserCreated';
  }
}

/**
 * ConsentGrantedEvent
 */
export class ConsentGrantedEvent extends DomainEvent {
  constructor(
    readonly userId: UserId,
    readonly consentType: ConsentType,
    readonly version: string,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.userId.value;
  }

  get eventName(): string {
    return 'ConsentGranted';
  }
}

/**
 * ConsentRevokedEvent
 */
export class ConsentRevokedEvent extends DomainEvent {
  constructor(
    readonly userId: UserId,
    readonly consentType: ConsentType,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.userId.value;
  }

  get eventName(): string {
    return 'ConsentRevoked';
  }
}

/**
 * RoleAssignedEvent
 */
export class RoleAssignedEvent extends DomainEvent {
  constructor(
    readonly userId: UserId,
    readonly role: Role,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.userId.value;
  }

  get eventName(): string {
    return 'RoleAssigned';
  }
}

/**
 * UserBlockedEvent
 */
export class UserBlockedEvent extends DomainEvent {
  constructor(
    readonly userId: UserId,
    readonly reason: string,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.userId.value;
  }

  get eventName(): string {
    return 'UserBlocked';
  }
}

/**
 * AdminLoggedInEvent - для audit log
 */
export class AdminLoggedInEvent extends DomainEvent {
  constructor(
    readonly userId: UserId,
    readonly role: Role,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.userId.value;
  }

  get eventName(): string {
    return 'AdminLoggedIn';
  }
}
