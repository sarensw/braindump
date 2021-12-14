
-- Crop
--   Position: 628x318
--   Size: 1600x1152

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

skc(125, 0.1)
enter()
writeTextQuick("# //d")
delay 1
enter()
enter()
enter()
writeTextQuick("Focus on writing down thoughts as quickly as possible.")
enter()
enter()
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
writeTextQuick("Highlight of: ")
enter()
tabtab()
writeText("Users: @john ")
enter()
writeText("Emails: john@getbraindump.app ")
enter()
writeText("Links: https://getbraindump.app ")
enter()
enter()
delay(3)
skCmd("T", 0.2)
delay(2)
writeText("# Must read books for 2022")
enter()
enter()
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
writeTextQuick("The Mom Test")
delay(0.2)
tabtab()
writeTextQuick("Rob Fitzpatrick")
delay(0.2)
tabtab()
writeTextQuick("2016")
delay(0.2)
tabtab()
writeTextQuick("138")
tabtab()

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

skc(53, 1)
skc(126, 1)
enter()

writeText("Use ESC to quickly jump between notes")

enter()
enter()

delay(5)