
interface Subjects {
  [topic: string]: {
    [id: string]: Function
  }
}

const subjects: Subjects = {}

function addListener (subject: string, func: Function): Function {
  const id = Math.random().toString(16).slice(2)
  if (Object.keys(subjects).includes(subject)) {
    subjects[subject][id] = func
  } else {
    subjects[subject] = {}
    subjects[subject][id] = func
  }

  return () => delete subjects?.[subject]?.[id]
}

function emit (subject: string): void {
  if (Object.keys(subjects).includes(subject)) {
    for (const id in subjects?.[subject]) {
      const func = subjects?.[subject]?.[id]
      func()
    }
  }
}

export { addListener, emit }
