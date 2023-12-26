import { Firestore } from '@google-cloud/firestore';
import { DbClient, ClientName } from '../../../types';
import admin from 'firebase-admin'

class FirestoreDb implements DbClient {
  private db!: Firestore;

  async connect(client: ClientName, connectionInfo: any, database?: string): Promise<void> {
    const { serverKeyPath, databaseURL } = connectionInfo;
    admin.initializeApp({
      credential: admin.credential.cert(require(serverKeyPath)),
      databaseURL: databaseURL
    });
    this.db = admin.firestore();
  }

  async close(): Promise<void> {
    // Firestore does not require explicit closing
  }

  async batchQuery(database: string, collection: string, offset: number, limit: number): Promise<any[]> {
    const querySnapshot = await this.db.collectionGroup(collection).offset(offset).limit(limit).get();
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async batchWrite(database: string, collection: string, docs: any[], idField: string | undefined): Promise<any> {
    const batch = this.db.batch();
    const collectionRef = this.db.collection(collection);
  
    docs.forEach((doc) => {
      let docRef: FirebaseFirestore.DocumentReference;
      if (idField && doc.hasOwnProperty(idField)) {
        const docId = doc[idField];
        docRef = collectionRef.doc(docId);
      } else {
        docRef = collectionRef.doc();
      }
      batch.set(docRef, doc);
    });
  
    await batch.commit();
  }
  

  async getDocumentCount(database: string, collection: string): Promise<number> {
    const collectionRef = this.db.collection(collection);
    const snapshot = await collectionRef.count().get();
    return snapshot.data().count;
  }

  async createEntity(database: string, collection: string): Promise<any> {
    // Firestore does not require explicit entity creation
  }

  async dropEntity(database: string, collection: string): Promise<void> {
    // Yet to be implemented
  }
}

export default FirestoreDb;