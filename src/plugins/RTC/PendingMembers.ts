import { RoomMember } from "@/store/modules/room/types";

type LocalScopeMember = Partial<RoomMember>;
type MemberEntry = {
  socketId: string;
  member: RoomMember;
};

export class PendingMembers {
  private _members = new Map<string, LocalScopeMember>();
  private _readyHandler?: (data: MemberEntry) => void;

  onMemberReady(callback: (data: MemberEntry) => void) {
    this._readyHandler = callback;
  }

  set(
    socketId: string,
    arg: {
      [k in keyof LocalScopeMember]: LocalScopeMember[k];
    }
  ) {
    const member = this._members.get(socketId);

    if (member) {
      const data = { ...member, ...arg };
      this._members.set(socketId, data);
      if (data.connection && data.identity && data.stream && data.dataChannel) {
        if (this._readyHandler)
          this._readyHandler({ socketId, member: data as RoomMember });
        this._members.delete(socketId);
      }
    } else this._members.set(socketId, arg);
  }

  get(socketId: string) {
    return this._members.get(socketId);
  }

  findByConn(conn: RTCPeerConnection) {
    return Array.from(this._members.entries()).find(
      ([_, member]) => member.connection === conn
    );
  }
}
