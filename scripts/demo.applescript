
-- Crop
--   Position: 628x318
--   Size: 1600x1152
-- Complete list of AppleScript key codes eastmanreference.com/complete-list-of-applescript-key-codes

tell application "Electron" to activate

delay 2

on sk(c, d)
  tell application "System Events"
    keystroke c
    delay d
  end tell
  return
end sk

on skCmd(c, d)
  tell application "System Events"
    keystroke c using command down
  end tell
  delay d
  return
end skCmd

on skcCmd(c, d)
  tell application "System Events"
    key code c using command down
  end tell
  delay d
  return
end skcCmd

on skcShift(c, d)
  tell application "System Events"
    key code c using shift down
  end tell
  delay d
  return
end skcCmd

on skc(c, d)
  tell application "System Events"
    key code c
  end tell
  delay d
  return
end skc

on writeText(theText)
  repeat with c in theText
    sk(c, 0.08)
  end repeat
end writeText

on writeTextQuick(theText)
  repeat with c in theText
    sk(c, 0.005)
  end repeat
end writeTextQuick

on enter()
  skc(76, 0.1)
end enter

on tabtab()
  skc(48, 0.1)
end tabtab

-- intro
skc(125, 0.1)
enter()
writeText("# //d")
delay 1
enter()
enter()
enter()
writeTextQuick("Focus on writing down thoughts as quickly as possible.")
enter()
enter()

-- tasks
writeText("[]Support for tasks ")
delay 1
skcCmd(123, 0.2)
skc(124, 0.2)
sk("x", 0.6)
sk("x", 0.6)
skcCmd(125, 0.2)
enter()
enter()
writeTextQuick("-Automatic list formatting ")
enter()

-- folding
writeTextQuick("Folding based on headlines ")
skcCmd({40, 29}, 0.2)
delay(1)
skcCmd({40, 38}, 0.2)
delay(0.4)
skc(121, 0.2)
enter()

-- highlighting
writeTextQuick("Highlighting of different elements ")
enter()
tabtab()
writeText("Users: @john ")
enter()
writeTextQuick("Emails: john@getbraindump.app ")
enter()
writeTextQuick("Links: https://getbraindump.app ")
enter()
enter()
delay(2)

-- keyboard
writeText("Keyboard driven ")
enter()
tabtab()
writeText("Uses the VSCode editor underneath -> supports the same shortcuts ")
enter()
writeText("Use cmd+t or cmd+w to create or close a note ")
delay(2)

-- create new dump
skCmd("T", 0.2)
delay(2)
skcShift(48, 0.2)
writeText("personal")
tabtab()
writeText("Must read books for 2022")
tabtab()
writeTextQuick("Support for custom snippets")
enter()
enter()
writeText("//")
delay(1)
writeText("b")
delay(0.5)
enter()
writeText("Twelve and a Half")
delay(0.4)
tabtab()
writeText("Gary Vaynerchuk")
delay(0.4)
tabtab()
writeText("2021")
delay(0.4)
tabtab()
writeText("288")
tabtab()
delay(2)

writeText("//b")
delay(0.2)
enter()
writeTextQuick("Atomic Habits")
delay(0.2)
tabtab()
writeTextQuick("James Clear")
delay(0.2)
tabtab()
writeTextQuick("2018")
delay(0.2)
tabtab()
writeTextQuick("320")
tabtab()

delay(2)

skc(53, 1) -- esc
skc(126, 1) -- down
enter()

enter()
enter()
writeText("Use ESC to quickly jump between notes")

enter()
enter()
enter()
enter()

-- inline code
writeText("Support for code blocks with syntax highlighting ")
enter()
enter()
writeText("```javascript ")
enter()
writeText("if (version.is('0.5')) { ")
enter()
writeText("  console.log('Hello code blocks!') ")
enter()
writeText("} ")
enter()
writeText("```")

enter()
enter()

delay(5)