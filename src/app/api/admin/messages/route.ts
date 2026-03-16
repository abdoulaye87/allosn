import { firestore } from '@/lib/firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch all messages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const read = searchParams.get('read')

    const messagesCollection = collection(firestore, 'messages')
    let q = query(messagesCollection)

    if (read !== null && read !== 'all') {
      q = query(q, where('read', '==', read === 'true'))
    }

    const snapshot = await getDocs(q)

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a: any, b: any) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )

    return NextResponse.json({ success: true, messages, total: messages.length })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// PUT - Mark message as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, read, reply } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    const messageRef = doc(firestore, 'messages', id)
    const updateData: any = {}
    if (read !== undefined) updateData.read = read
    if (reply) updateData.reply = reply

    await updateDoc(messageRef, updateData)

    return NextResponse.json({ success: true, message: 'Message mis à jour' })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// DELETE - Delete a message
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    await deleteDoc(doc(firestore, 'messages', id))

    return NextResponse.json({ success: true, message: 'Message supprimé' })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// POST - Create a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const messagesCollection = collection(firestore, 'messages')
    const docRef = await addDoc(messagesCollection, {
      ...body,
      read: false,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true, id: docRef.id, message: 'Message envoyé' })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
