class PeerService {
  peer: RTCPeerConnection | null;

  constructor() {
    this.peer = this.createPeerConnection();
  }

  private createPeerConnection(): RTCPeerConnection {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }

  async getAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(ans);
      return ans;
    }
  }

  async setLocalDesc(ans: RTCSessionDescriptionInit) {
    if (this.peer) {
      try {
        await this.peer.setRemoteDescription(ans);
      } catch (error) {
        console.error("Error in setLocalDescription:", error);
      }
    }
  }

  async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    }
  }

  closeConnection(): void {
    if (this.peer) {
      // Close all tracks of each stream
      this.peer.getSenders().forEach(sender => sender.track?.stop());
      this.peer.getReceivers().forEach(receiver => receiver.track?.stop());
      
      // Close the peer connection
      this.peer.close();
      this.peer = null;
    }
  }

  isConnectionActive(): boolean {
    return this.peer?.iceConnectionState === "connected" || this.peer?.iceConnectionState === "completed";
  }

  restartConnection() {
    if (!this.isConnectionActive()) {
      this.closeConnection();
      this.peer = this.createPeerConnection();
    }
  }
}

export default new PeerService();
