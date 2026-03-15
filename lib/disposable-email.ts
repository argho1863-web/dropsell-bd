// List of common disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","10minutemail.com","tempmail.com",
  "throwaway.email","yopmail.com","sharklasers.com","guerrillamailblock.com",
  "grr.la","guerrillamail.info","guerrillamail.biz","guerrillamail.de",
  "guerrillamail.net","guerrillamail.org","spam4.me","trashmail.com",
  "trashmail.me","trashmail.net","trashmail.at","trashmail.io","trashmail.xyz",
  "dispostable.com","mailnull.com","spamgourmet.com","spamgourmet.net",
  "spamgourmet.org","binkmail.com","bob.email","clrmail.com","discard.email",
  "discardmail.com","discardmail.de","fakeinbox.com","filzmail.com",
  "getnada.com","gishpuppy.com","hmamail.com","inboxbear.com","jnxjn.com",
  "jourrapide.com","kasmail.com","klassmaster.com","klzlk.com","kurzepost.de",
  "letthemeatspam.com","lol.ovpn.to","maildrop.cc","mailexpire.com",
  "mailforspam.com","mailfreeonline.com","mailguard.me","mailimate.com",
  "mailme.lv","mailnew.com","mailnull.com","mailscrap.com","mailseal.de",
  "mailshell.com","mailsiphon.com","mailtemp.info","mailtrash.net",
  "mailtv.net","mailzilla.org","mega.zik.dj","meltmail.com","mierdamail.com",
  "mohmal.com","moncourrier.fr.nf","monemail.fr.nf","monmail.fr.nf",
  "msa.minsmail.com","mt2009.com","mt2014.com","mytrashmail.com",
  "noblepioneer.com","noclickemail.com","nogmailspam.info","nomail.xl.cx",
  "nomail2me.com","nospamfor.us","nospamthanks.info","notmailinator.com",
  "nowmymail.com","objectmail.com","odaymail.com","oneoffemail.com",
  "onewaymail.com","online.ms","ownmail.net","pecinan.com","pookmail.com",
  "powered.name","privacy.net","proxymail.eu","prtnx.com","punkass.com",
  "putthisinyourspamdatabase.com","qq.com.temp","rcpt.at","recode.me",
  "recursor.net","regbypass.com","regbypass.comsafe-mail.net","safetymail.info",
  "safetypost.de","sendspamhere.com","sharedmailbox.org","sharklasers.com",
  "shiftmail.com","shitmail.me","shortmail.net","sibmail.com","skeefmail.com",
  "slaskpost.se","slopsbox.com","smapfree24.com","smapfree24.de",
  "smapfree24.eu","smapfree24.info","smapfree24.net","smapfree24.org",
  "smellfear.com","snakemail.com","sneakemail.com","sneakmail.de",
  "sofimail.com","sogetthis.com","solopilotos.com","spam.la","spam.org.tr",
  "spam.su","spam4.me","spamavert.com","spamcon.org","spamevader.net",
  "spamfree24.com","spamgoes.in","spamherelots.com","spamhereplease.com",
  "spamhole.com","spamify.com","spaminmotion.com","spamkill.info","spaml.com",
  "spammotel.com","spamoff.de","spamslicer.com","spamspot.com","spamstack.net",
  "spamthis.co.uk","spamthisplease.com","spamtrail.com","speed.1s.fr",
  "suremail.info","sweetpotato.ml","tafmail.com","tagyourself.com",
  "teleworm.us","tempalias.com","tempinbox.co.uk","tempinbox.com",
  "tempmail.it","tempmaildemo.com","tempomail.fr","temporaryemail.net",
  "temporaryemail.us","temporaryforwarding.com","temporaryinbox.com",
  "thankyou2010.com","thisisnotmyrealemail.com","throwam.com","throwam.org",
  "tilien.com","tmailinator.com","toiea.com","toomail.biz","tradermail.info",
  "trash-amil.com","trash-mail.at","trash-mail.cf","trash-mail.ga",
  "trash-mail.gq","trash-mail.ml","trash-mail.tk","trashdevil.com",
  "trashdevil.de","trashemail.de","trashimail.com","trashmail.at",
  "trashmail.com","trashmail.io","trashmail.me","trashmail.net",
  "trashmailer.com","trashymail.com","tyldd.com","uggsrock.com",
  "upliftnow.com","uplipht.com","uroid.com","us.af","venompen.com",
  "veryday.ch","viditag.com","viewcastmedia.com","viewcastmedia.net",
  "viewcastmedia.org","vomoto.com","vsimcard.com","walala.org","walkmail.net",
  "webemail.me","webm4il.info","weg-werf-email.de","wetrainbayarea.org",
  "wh4f.org","whyspam.me","willselfdestruct.com","wilemail.com","winemaven.info",
  "wronghead.com","wuzupmail.net","xagloo.com","xemaps.com","xents.com",
  "xmaily.com","xoxy.net","xyzfree.net","yapped.net","yeah.net",
  "yep.it","yogamaven.com","yopmail.com","yopmail.fr","yopmail.gq",
  "youmailr.com","ypmail.webarnak.fr.eu.org","yuurok.com","z1p.biz",
  "za.com","zehnminuten.de","zehnminutenmail.de","zippymail.info",
  "zoemail.net","zoemail.org","zomg.info","zxcv.com","zxcvbnm.com"
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.has(domain);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && !isDisposableEmail(email);
}
